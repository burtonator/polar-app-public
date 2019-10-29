import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

/**
 * An interval over [0.0, 1.0]
 */
export type ConfidenceInterval = number;
/**
 * The answer of review base on a confidence interval.
 */
export type Answer = ConfidenceInterval;
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
export interface Schedule extends Review {
    readonly nextReviewDate: Date;
}

export type DateLike = number | string | Date;

export type Days = number;

/**
 * Stores metadata needed for computing the next scheduling event.
 */
export interface Review {

    /**
     * The time this item was reviewed.  For new cards use the current time and the set an 'interval' to the default
     * interval which is probably 1 day.
     */
    readonly reviewedAt: ISODateTimeString

    readonly difficulty: Difficulty;

    readonly interval: Days;

}

export type Stage = 'new' | 'learning' | 'graduated';
/**
 * The type of repetition mode we're in.  Either flashcard or reading mode.  Reading tends to be more involved so we
 * have different intervals for this mode.
 */
export type RepetitionMode = 'flashcard' | 'reading';
