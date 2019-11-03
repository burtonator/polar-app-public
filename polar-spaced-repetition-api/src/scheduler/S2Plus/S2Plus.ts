import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {DurationStr} from "polar-shared/src/util/TimeDurations";
import {IDStr} from "polar-shared/src/util/Strings";

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

export interface LearningState {

    readonly reviewedAt: ISODateTimeString

    readonly interval: DurationStr;

    /**
     * The remaining intervals, if any.
     */
    readonly intervals: ReadonlyArray<DurationStr>;

}

/**
 * Stores metadata needed for computing the next scheduling event.
 */
export interface ReviewState {

    /**
     * The time this item was reviewed.  For new cards use the current time and the set an 'interval' to the default
     * interval which is probably 1 day.
     */
    readonly reviewedAt: ISODateTimeString

    readonly difficulty: Difficulty;

    readonly interval: DurationStr;

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
export type Stage = 'new' | 'learning' | 'review';

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

    readonly stage: Stage;

    readonly state: ReviewState | LearningState;

}

export type ItemType = 'flashcard' | 'reading';
