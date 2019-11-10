import {Dates, daysToMillis} from './Dates';
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Answer, Days, Rating, ReviewState, Schedule} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Duration, TimeDurations} from "polar-shared/src/util/TimeDurations";

const GRADE_CUTOFF = 0.6;

/**
 * https://github.com/pensieve-srs/pensieve-srs
 * http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2
 */
export class S2Plus {

    public static DEFAULT_DIFFICULTY = 0.3;

    public static DEFAULT_INTERVAL = '1d';

    public static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    public static calcRecallRate(reviewedAt: Date, interval: Days, timestamp = new Date()) {
        const diff = Dates.diffDays(timestamp, reviewedAt);
        const recall = 2 ** (-diff / interval);
        return Math.ceil(recall * 100) / 100;
    }

    public static calcPercentOverdue(reviewedAt: Date, duration: Duration, timestamp = new Date()) {

        if (duration === '') {
            throw new Error("Interval must be a non-empty valid string");
        }

        const diff = Dates.diffDays(timestamp, reviewedAt);
        const calculated = diff / Dates.toDays(duration);
        return Math.min(2, calculated);
    }

    public static ratingToAnswer(rating: Rating): Answer {
        // these only really apply to the review stage.

        switch (rating) {
            case 'again':
                return 0.00;
            case 'hard':
                return 0.25;
            case 'good':
                return 0.75;
            case 'easy':
                return 1.00;
        }

    }

    public static calculateFromRating(review: ReviewState, rating: Rating): Schedule {
        const answer = this.ratingToAnswer(rating);
        return S2Plus.calculate(review, answer);
    }
    /**
     *
     * @param review The rating data persisted between ratings of the user.
     *
     * @param answer After an item is attempted, choose a answer from [0.0, 1.0], with 1.0 being
     * the best.  Set a cutoff point for the answer being “correct” (default is 0.6). Then set
     *
     */
    public static calculate(review: ReviewState,
                            answer: Answer): Schedule {

        const timestamp = new Date();

        const reviewedAt = ISODateTimeStrings.parse(review.reviewedAt);
        const percentOverdue = this.calcPercentOverdue(reviewedAt, review.interval, timestamp);

        const difficultyDelta = percentOverdue * (1 / 17) * (8 - 9 * answer);
        const difficulty = this.clamp(review.difficulty + difficultyDelta, 0, 1);

        const difficultyWeight = 3 - 1.7 * difficulty;

        let intervalDelta;
        if (answer < GRADE_CUTOFF) {
            intervalDelta = Math.round(1 / difficultyWeight ** 2) || 1;
        } else {
            intervalDelta = 1 + Math.round((difficultyWeight - 1) * percentOverdue);
        }

        const interval = Dates.toDays(review.interval) * intervalDelta;

        const nextReviewDate = Dates.addDays(timestamp, interval);

        const intervalStr = TimeDurations.format(daysToMillis(interval));

        if (intervalStr === '') {
            throw new Error("Interval may not be an empty string");
        }

        return {
            difficulty,
            interval: intervalStr,
            nextReviewDate: nextReviewDate.toISOString(),
            reviewedAt: timestamp.toISOString(),
        };

    }

}
