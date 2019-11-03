import {IDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {
    Answer,
    ISpacedRep,
    LearningState,
    ReviewState,
    Rating,
    LapsedState
} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Duration, DurationMS, TimeDurations} from "polar-shared/src/util/TimeDurations";
import {AsyncWorkQueue} from "polar-shared/src/util/AsyncWorkQueue";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Learning} from "./Learning";
import {S2Plus} from "./S2Plus";

export class TasksCalculator {

    /**
     * The amount of time to wait to process the card again when it has lapsed.
     */
    public static LAPSE_INIT_INTERVAL: Duration = '1d';

    /**
     * The factor we use to restore the new interval against the review interval once we're ready to continue working
     * add it back to the review stage.
     */
    public static LAPSE_REVIEW_NEW_INTERVAL_FACTOR = 0.0;

    /**
     * The minimum amount of time to wait when we added it back as a review card.
     */
    public static LAPSE_REVIEW_NEW_INTERVAL_MIN: Duration = '4d';

    /**
     * Take potential work and use data from the backend to prioritize it for the user.
     */
    public static async calculate(opts: CalculateOpts): Promise<ReadonlyArray<TaskRep>> {

        const taskReps: TaskRep[] = [];

        const jobs = opts.potential.map((current) => async () => {
            const taskRep = await opts.resolver(current);
            taskReps.push(taskRep);
        });

        const asyncWorkQueue = new AsyncWorkQueue(jobs);

        await asyncWorkQueue.execute();

        const prioritized =
            taskReps.filter(current => current.age > 0)  // they have to be expired and ready to evaluate.
                    .filter(current => current.suspended !== true) // if they're suspended we have to ignore
                    .sort((a, b) => b.age - a.age);

        return Arrays.head(prioritized, opts.limit);

    }

    private static computeAgeFromReviewedAt(reviewedAt: ISODateTimeString) {
        return Date.now() - ISODateTimeStrings.parse(reviewedAt).getTime();
    }

    public static computeAge(current: ISpacedRep) {
        return this.computeAgeFromReviewedAt(current.state.reviewedAt);
    }


    /**
     * Compute the next space repetition intervals/state from the current and the given answer.
     */
    public static computeNextSpacedRep(taskRep: TaskRep, rating: Rating): ISpacedRep {

        // FIXME: if we hit 'again' when in review mode, we have to set the the interval to 1d
        // so we review it again tomorrow.

        const computeLearning = (): ISpacedRep => {

            if (rating === 'again') {
                // 'again' should revert back to the beginning of all the intervals
                return this.createInitialSpacedRep(taskRep);
            }

            const learningState = <LearningState> taskRep.state;

            if (rating === 'easy' || learningState.intervals.length === 0) {

                // we're graduating into review. Easy should mean we jump
                // immediately into review mode

                const state: ReviewState = {
                    reviewedAt: ISODateTimeStrings.create(),
                    difficulty: Learning.DEFAULT_GRADUATING_DIFFICULTY,
                    interval: Learning.DEFAULT_GRADUATING_INTERVAL
                };

                return {
                    id: taskRep.id,
                    suspended: taskRep.suspended,
                    stage: 'review',
                    state: state
                };

            }

            const intervals = [...learningState.intervals];
            const interval = intervals.shift()!;

            const state: LearningState = {
                reviewedAt: ISODateTimeStrings.create(),
                intervals,
                interval
            };

            return {
                id: taskRep.id,
                suspended: taskRep.suspended,
                stage: 'learning',
                state
            };

        };

        const computeReview = (): ISpacedRep => {

            const reviewState = <ReviewState> taskRep.state;

            /**
             * Compute a new lapsed stage due to the user selecting 'again'
             */
            const computeLapsedDueToAgain = (): ISpacedRep => {

                const state: LapsedState = {
                    reviewedAt: ISODateTimeStrings.create(),
                    interval: this.LAPSE_INIT_INTERVAL,
                    reviewState
                };

                const lapses = taskRep.lapses !== undefined ? taskRep.lapses + 1 : 1;

                return {
                    id: taskRep.id,
                    suspended: taskRep.suspended,
                    lapses,
                    stage: 'lapsed',
                    state,
                };

            };

            if (rating === 'again') {
                return computeLapsedDueToAgain();
            }

            const schedule = S2Plus.calculateFromRating(reviewState, rating);

            const state: ReviewState = {
                ...schedule,
                reviewedAt: ISODateTimeStrings.create(),
            };

            return {
                id: taskRep.id,
                suspended: taskRep.suspended,
                lapses: taskRep.lapses,
                stage: 'review',
                state
            };

        };

        const computeLapsed = (): ISpacedRep => {

            const lapsedState = <LapsedState> taskRep.state;

            const {reviewState} = lapsedState;

            // We need to take the reviewState, compute a NEW review state, and THEN apply
            // LAPSE_REVIEW_NEW_INTERVAL_FACTOR and  LAPSE_REVIEW_NEW_INTERVAL_MIN
            const schedule = S2Plus.calculateFromRating(reviewState, rating);

            const computedInterval = TimeDurations.toMillis(schedule.interval) * this.LAPSE_REVIEW_NEW_INTERVAL_FACTOR;
            const minInterval = TimeDurations.toMillis(this.LAPSE_REVIEW_NEW_INTERVAL_MIN);

            const interval = Math.max(computedInterval, minInterval);

            const state: ReviewState = {
                reviewedAt: ISODateTimeStrings.create(),
                difficulty: schedule.difficulty,
                interval
            };

            // now the stage goes back to review but we have a much smaller interval now...
            return {
                id: taskRep.id,
                suspended: taskRep.suspended,
                lapses: taskRep.lapses,
                stage: 'review',
                state
            };

        };

        switch (taskRep.stage) {

            case "learning":
                return computeLearning();

            case "review":
                return computeReview();

            case "lapsed":
                return computeLapsed();

            default:
                throw new Error("Not supported: " + taskRep.stage);

        }

    }


    public static createInitialSpacedRep(task: Task): ISpacedRep {

        const intervals = [...Learning.intervals('reading')];
        const interval = intervals.shift()!;

        return {
            id: task.id,
            stage: "learning",
            state: {
                reviewedAt: task.created,
                interval,
                intervals
            }
        }

    }

    public static createInitialLearningState(task: Task): TaskRep {

        const spacedRep = this.createInitialSpacedRep(task);

        const intervalMS = TimeDurations.toMillis(spacedRep.state.interval);
        const created = ISODateTimeStrings.parse(task.created);
        const age = Date.now() - (created.getTime() + intervalMS);

        return {
            ...task,
            ...spacedRep,
            age,
        }

    }

}

/**
 * Return a WorkRep if we were able to find it or undefined.
 */
export type OptionalTaskRepResolver = (task: Task) => Promise<TaskRep | undefined>;

/**
 * Return a WorkRep or a default rep if we're unable to find it.
 */
export type TaskRepResolver = (task: Task) => Promise<TaskRep>;

/**
 * If we don't have an explicit state, then we need to compute a new one...
 *
 */
export function createDefaultTaskRepResolver(delegate: OptionalTaskRepResolver): TaskRepResolver {

    return async (task: Task): Promise<TaskRep> => {

        const result = await delegate(task);

        if (result) {
            return result;
        }

        return TasksCalculator.createInitialLearningState(task);

    };

}

export interface CalculateOpts {

    readonly potential: ReadonlyArray<Task>;

    /**
     * Given a task, resolve the space rep metadata.
     */
    readonly resolver: TaskRepResolver;

    /**
     * The limit of the number of tasks to return.
     */
    readonly limit: number;

}


export interface Task {

    readonly id: IDStr;

    readonly text: string;

    /**
     * The time the items was first created. This is used to compute the initial age.
     */
    readonly created: ISODateTimeString;

    readonly color: HighlightColor;

}

export interface TaskRep extends ISpacedRep, Task {

    /**
     * The age of the work so we can sort the priority queue.
     */
    readonly age: DurationMS;

}
