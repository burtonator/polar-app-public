import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Duration, DurationMS, DurationStr} from "polar-shared/src/util/TimeDurations";
import {IDStr} from "polar-shared/src/util/Strings";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

/**
 * An interval over [0.0, 1.0]
 */
export type ConfidenceInterval = number;
/**
 * The answer of review base on a confidence interval.
 */
export type Answer = ConfidenceInterval;

/**
 * The ratings for learning.
 */
export type LearningRating = 'again' | 'good' | 'easy';

/**
 * The rating for reviews
 */
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

/**
 * When a card is in learning mode:
 *
 * - again: restarts the card to the starting intervals and goes through the entire routine
 * - good: moves to the next learning interval
 * - easy: automatically jumps the card to review:
 *
 * When a card is in review mode:
 *
 * - again: causes the card to lapse and reviews it more frequently
 * - hard: shows it slightly more often in the future
 * - good: the delay was about right and don't adjust the difficulty.
 * - easy: delay even further in the future. It's best to probably pick good most of the time.
 */
export type Rating = LearningRating | ReviewRating;

/**
 * How difficult the item is, from [0.0, 1.0].  Defaults to 0.3 (if the software
 * has no way of determining a better default for an item)
 *
 * This requires setting a max value for easiness, which I set to 3.0.  I also replaced easiness with difficulty,
 * because it’s the more natural thing to measure.
 */
export type Difficulty = ConfidenceInterval;

/**
 * The next review and next review date.
 */
export interface Schedule extends ReviewState {
    readonly nextReviewDate: ISODateTimeString;
}

export type DateLike = number | string | Date;

export type Days = number;

export interface BaseState {

    /**
     * The time this item was reviewed.  For new cards use the current time and the set an 'interval' to the default
     * interval which is probably 1 day.
     */
    readonly reviewedAt: ISODateTimeString

    /**
     * The amount of time until this task is due.
     */
    readonly interval: Duration;

}

export interface LearningState extends BaseState {

    /**
     * The remaining intervals, if any, that need to be completed until moving to the review state.
     */
    readonly intervals: ReadonlyArray<DurationStr>;

}

/**
 * Stores metadata needed for computing the next scheduling event.
 */
export interface ReviewState extends BaseState {

    readonly difficulty: Difficulty;

}

export interface LapsedState extends BaseState {

    /**
     * The stage prior to lapsing so we can compute a new review interval once we've reviewed it once as a lapsed card.
     */
    readonly reviewState: ReviewState;

}

/**
 * - New cards are cards that have never had any sort of review
 *
 * - Learning cards are cards that you're currently working on but have not yet graduated to use SR intervals.
 *
 * - Graduated cards are cards that have left learning and are going through interval calculation. These are also
 *   sometimes called review cards.
 *
 */
export type Stage = 'new' | 'learning' | 'review' | 'lapsed';

/**
 * The type of repetition mode we're in.  Either flashcard or reading mode.  Reading tends to be more involved so we
 * have different intervals for this mode.
 */
export type RepetitionMode = 'flashcard' | 'reading';

export interface ISpacedRep {

    /**
     * The ID if the key we're working with.
     */
    readonly id: IDStr;

    /**
     * True when the card is suspended and no longer available for review.
     */
    readonly suspended?: boolean;

    /**
     * The number of lapses on this card.  Used to track bad/poor cards.
     */
    readonly lapses?: number;

    readonly stage: Stage;

    readonly state: ReviewState | LearningState | LapsedState;

}

export type ItemType = 'flashcard' | 'reading';

/**
 * Perform a task with a given action.
 */
export interface Task<A> {

    readonly id: IDStr;

    /**
     * The action that the user has to complete.  If this is a string it's just a reading task but if it's a flashcard
     * we have to bring up a flashcard UI with a 'show answer' button.
     */
    readonly action: A;

    /**
     * The time the items was first created. This is used to compute the initial age.
     */
    readonly created: ISODateTimeString;

    // FIXME: move this over to ReadingTaskAction
    readonly color?: HighlightColor;

    /**
     * The mode that this task uses when computing new intervals (flashcard or reading).
     */
    readonly mode: RepetitionMode;

}


export interface TaskRep<A> extends ISpacedRep, Task<A> {

    /**
     * The age of the work so we can sort the priority queue.
     */
    readonly age: DurationMS;

}

export interface MutableStageCounts {

    nrNew: number;

    /**
     * The number of cards in learning stage.
     */
    nrLearning: number;

    /**
     * The number of cards in review stage.
     */
    nrReview: number;

    /**
     * The number of cards in lapsed stage.
     */
    nrLapsed: number;

}

/**
 * Number of cards in a given stage.
 */
export interface StageCounts extends Readonly<MutableStageCounts> {


}

export class StageCountsCalculator {

    public static createMutable(): MutableStageCounts {

        return {
            nrNew: 0,
            nrLearning: 0,
            nrLapsed: 0,
            nrReview: 0
        };

    }

    public static calculate(tasks: ReadonlyArray<TaskRep<any>>): StageCounts {

        let nrNew = 0;
        let nrLearning = 0;
        let nrReview = 0;
        let nrLapsed = 0;

        for (const task of tasks) {
            switch (task.stage) {

                case "new":
                    ++nrNew;
                    break;
                case "learning":
                    ++nrLearning;
                    break;
                case "review":
                    ++nrReview;
                    break;
                case "lapsed":
                    ++nrLapsed;
                    break;

            }
        }

        return {nrNew, nrLearning, nrReview, nrLapsed};

    }

}
