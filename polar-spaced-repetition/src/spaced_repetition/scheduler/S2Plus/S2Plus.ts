import {Dates} from './Dates';
import {Days} from './Dates';

const GRADE_MIN = 0;
const GRADE_MAX = 1;
const GRADE_CUTOFF = 0.6;


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
 * Stores metadata needed for computing the next scheduling event.
 */
export interface Rating {

    /**
     * The time this item was reviewed.  For new cards use the current time and the set an 'interval' to the default
     * interval which is probably 1 day.
     */
    readonly reviewedAt: Date;

    readonly difficulty: Difficulty;

    readonly interval: Days;

}

export interface Scheduling extends Rating {
    readonly nextReviewDate: Date;
}


/**
 * TODO
 *  - What is 'difficulty' and why do we need to have it per i...
 *
 *  - What do we use to prioritize the next round of training?  it has to be a
 *    queue but how do I sort the queue?
 *  -
 */

/**
 * https://github.com/pensieve-srs/pensieve-srs
 * http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2
 */
export class S2Plus {

    public static DEFAULT_DIFFICULTY = 0.3;

    public static DEFAULT_INTERVAL = 1;

    public static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    public static calcRecallRate(reviewedAt: Date, interval: Days, timestamp = new Date()) {
        const diff = Dates.diffDays(timestamp, reviewedAt);
        const recall = 2 ** (-diff / interval);
        return Math.ceil(recall * 100) / 100;
    }

    public static calcPercentOverdue(reviewedAt: Date, interval: Days, timestamp = new Date()) {
        const diff = Dates.diffDays(timestamp, reviewedAt);
        const calculated = diff / interval;
        return Math.min(2, calculated);
    }


    // FIXME: rating and performance are confusing variable names.

    /**
     *
     *
     *
     * @param rating The rating data persisted between ratings of the user.  This is the LAST rating.  The current
     *
     * @param answer After an item is attempted, choose a answer from [0.0, 1.0], with 1.0 being
     * the best.  Set a cutoff point for the answer being “correct” (default is 0.6). Then set
     *
     */
    public static calculate(rating: Rating,
                            answer: Answer): Scheduling {

        const timestamp = new Date();

        const percentOverdue = this.calcPercentOverdue(rating.reviewedAt, rating.interval, timestamp);

        const difficultyDelta = percentOverdue * (1 / 17) * (8 - 9 * answer);
        const difficulty = this.clamp(rating.difficulty + difficultyDelta, 0, 1);

        const difficultyWeight = 3 - 1.7 * difficulty;

        let intervalDelta;
        if (answer < GRADE_CUTOFF) {
            intervalDelta = Math.round(1 / difficultyWeight ** 2) || 1;
        } else {
            intervalDelta = 1 + Math.round((difficultyWeight - 1) * percentOverdue);
        }

        const interval = rating.interval * intervalDelta;

        const nextReviewDate = Dates.addDays(timestamp, interval);

        return {
            difficulty,
            interval,
            nextReviewDate,
            reviewedAt: timestamp,
        };

    }

}
