import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {
    ISpacedRep,
    LapsedState,
    LearningState,
    Rating,
    ReviewState, StageCounts, StageCountsCalculator,
    Task
} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Duration, DurationMS, TimeDurations} from "polar-shared/src/util/TimeDurations";
import {AsyncWorkQueue} from "polar-shared/src/util/AsyncWorkQueue";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Learning} from "./Learning";
import {S2Plus} from "./S2Plus";

export interface CalculatedTaskReps<A> {

    /**
     * The task reps that need to be completed.
     */
    readonly taskReps: ReadonlyArray<TaskRep<A>>;

    readonly stageCounts: StageCounts;
}

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
    public static async calculate<A>(opts: CalculateOpts<A>): Promise<CalculatedTaskReps<A>> {

        const resolvedTaskReps: TaskRep<A>[] = [];

        const jobs = opts.potential.map((current) => async () => {
            const taskRep = await opts.resolver(current);
            resolvedTaskReps.push(taskRep);
        });

        const asyncWorkQueue = new AsyncWorkQueue(jobs);

        await asyncWorkQueue.execute();

        const prioritizedTaskReps =
            resolvedTaskReps.filter(current => current.age >= 0)  // they have to be expired and ready to evaluate.
                    .filter(current => current.suspended !== true) // if they're suspended we have to ignore
                    .sort((a, b) => b.age - a.age);

        const taskReps = Arrays.head(prioritizedTaskReps, opts.limit);

        const stageCounts = StageCountsCalculator.calculate(prioritizedTaskReps);

        console.log("New stageCounts: ", stageCounts)

        return {taskReps, stageCounts};

    }

    private static computeAgeFromReviewedAt(reviewedAt: ISODateTimeString, duration: Duration) {
        const dueAt = ISODateTimeStrings.parse(reviewedAt).getTime() + TimeDurations.toMillis(duration);
        return Date.now() - dueAt;
    }

    public static computeAge(current: ISpacedRep) {
        return this.computeAgeFromReviewedAt(current.state.reviewedAt, current.state.interval);
    }


    /**
     * Compute the next space repetition intervals/state from the current and the given answer.
     */
    public static computeNextSpacedRep<A>(taskRep: TaskRep<A>, rating: Rating): ISpacedRep {

        const computeLearning = (): ISpacedRep => {

            if (rating === 'again') {
                // 'again' should revert back to the beginning of all the intervals
                return this.createInitialSpacedRep(taskRep, ISODateTimeStrings.create());
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
                    state
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


    public static createInitialSpacedRep<A>(task: Task<A>,
                                            reviewedAt: ISODateTimeString = task.created): ISpacedRep {

        const intervals = [...Learning.intervals(task.mode)];
        const interval = intervals.shift()!;

        return {
            id: task.id,
            stage: "learning",
            state: {
                reviewedAt,
                interval,
                intervals
            }
        }

    }

    public static createInitialLearningState<A>(task: Task<A>): TaskRep<A> {

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
export interface OptionalTaskRepResolver<A> {
    (task: Task<A>): Promise<TaskRep<A> | undefined>;
}

/**
 * Return a WorkRep or a default rep if we're unable to find it.
 */
export interface TaskRepResolver<A> {
    (task: Task<A>): Promise<TaskRep<A>>;
}

/**
 * If we don't have an explicit state, then we need to compute a new one...
 *
 */
export function createDefaultTaskRepResolver<A>(delegate: OptionalTaskRepResolver<A>): TaskRepResolver<A> {

    return async (task: Task<A>): Promise<TaskRep<A>> => {

        const result = await delegate(task);

        if (result) {
            return result;
        }

        return TasksCalculator.createInitialLearningState(task);

    };

}

export interface CalculateOpts<A> {

    readonly potential: ReadonlyArray<Task<A>>;

    /**
     * Given a task, resolve the space rep metadata.
     */
    readonly resolver: TaskRepResolver<A>;

    /**
     * The limit of the number of tasks to return.
     */
    readonly limit: number;

}

export interface TaskRep<A> extends ISpacedRep, Task<A> {

    /**
     * The age of the work so we can sort the priority queue.
     */
    readonly age: DurationMS;

}

