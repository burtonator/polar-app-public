import {expect} from 'chai';
import {oneWeekAgo} from './DateConstants';
import {oneDayAgo} from './DateConstants';
import {today} from './DateConstants';
import {Dates} from './Dates';
import {PerformanceRating, S2Plus} from './S2Plus';
import {DEFAULT_DIFFICULTY} from './S2Plus';
import {DEFAULT_INTERVAL} from './S2Plus';
import {Days} from './Dates';
import {Difficulty} from './S2Plus';
import {twoDaysAgo} from './DateConstants';
import {TestingTime} from "polar-shared/src/test/TestingTime";

interface TestScheduling {
    readonly difficulty: Difficulty;
    readonly interval: Days;
}

interface TestCalculate {
    readonly prevReviewedAt: Date,
    readonly performanceRating: PerformanceRating,
    readonly prevDifficulty: Difficulty,
    readonly prevInterval: Days,
    readonly scheduling: TestScheduling,
}

const testData = [
    {
        reviewedAt: oneWeekAgo,
        interval: 7,
        percentOverdue: 1,
        recallRate: 0.5,
    },
    {
        reviewedAt: oneWeekAgo,
        interval: 14,
        percentOverdue: 0.5,
        recallRate: 0.71,
    },
    {
        reviewedAt: oneWeekAgo,
        interval: 1,
        percentOverdue: 2,
        recallRate: 0.01,
    },
    {
        reviewedAt: oneDayAgo,
        interval: 1,
        percentOverdue: 1,
        recallRate: 0.5,
    },
    {
        reviewedAt: oneDayAgo,
        interval: 4,
        percentOverdue: 0.25,
        recallRate: 0.85,
    },
    {
        reviewedAt: today,
        interval: 4,
        percentOverdue: 0,
        recallRate: 1,
    },
];

const testDataCalculate: ReadonlyArray<TestCalculate> = [
    {
        prevReviewedAt: Dates.subtractDays(today, 1),
        performanceRating: 1,
        prevDifficulty: 0.5,
        prevInterval: 1,
        scheduling: {
            difficulty: 0.44,
            interval: 2
        },
    },
    {
        prevReviewedAt: Dates.subtractDays(today, 10),
        performanceRating: 1,
        prevDifficulty: 0.5,
        prevInterval: 5,
        scheduling: {
            difficulty: 0.38,
            interval: 20
        },
    },
    {
        prevReviewedAt: Dates.subtractDays(today, 18),
        performanceRating: 0,
        prevDifficulty: 0.3,
        prevInterval: 14,
        scheduling: {
            difficulty: 0.91,
            interval: 14
        },
    },
    {
        prevReviewedAt: Dates.subtractDays(today, 200),
        performanceRating: 1,
        prevDifficulty: 0.3,
        prevInterval: 100,
        scheduling: {
            difficulty: 0.18,
            interval: 400
        }
    },
];

describe("calcRecallRate", () => {
    it("it should return recall rate", () => {

        for (const data of testData) {
            const { reviewedAt, interval, recallRate } = data;
            const result = S2Plus.calcRecallRate(reviewedAt, interval);
            expect(result).to.equal(recallRate);
        }

    });

});

describe("calcPercentOverdue", () => {

    it("should return the percent overdue for an item reviewed in the past", () => {

        for (const data of testData) {
            const { reviewedAt, interval, percentOverdue } = data;
            console.log("data: ", JSON.stringify(data, null, "  "));

            const actual = S2Plus.calcPercentOverdue(reviewedAt, interval);
            expect(actual).to.equal(percentOverdue);
        }

    });

    it("should return a maximum value of 2", () => {
        const actual = S2Plus.calcPercentOverdue(oneWeekAgo, 1);
        expect(actual).to.equal(2);
    });

});

describe("calculate", () => {

    beforeEach(function() {
        TestingTime.freeze();
    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    it("should calculate the next review data", () => {

        for (const data of testDataCalculate) {
            const { prevReviewedAt, prevDifficulty, prevInterval, performanceRating, scheduling } = data;
            const result = S2Plus.calculate(prevReviewedAt, prevDifficulty, prevInterval, performanceRating, today);
            expect(result.reviewedAt).to.equal(today);
            expect(result.interval).to.equal(scheduling.interval);
            expect(result.difficulty.toFixed(2)).to.equal(scheduling.difficulty.toString());
        }

    });

    it("should calculate the next review data", () => {

        // const result0 = S2Plus.calculate(reviewedAt, difficulty, interval, performanceRating, today);

    });


    it("basic", () => {

        // TODO: what is difficulty and interval.. ???
        //
        //  - why is reviewedAt its own value?
        //
        //  - I think by default we have to have a queue of new cards which do
        //    not yet have reviews..

        const debugCalc = (reviewedAt: Date,
                           prevDifficulty: Difficulty,
                           prevInterval: Days,
                           performanceRating: number,
                           timestamp = new Date()) => {

            const result = S2Plus.calculate(reviewedAt, prevDifficulty, prevInterval, performanceRating, timestamp);
            console.log(JSON.stringify(result, null, "  "));

        };

        // const [reviewedAt, difficulty, interval, performanceRating] = [oneDayAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0 ];
        debugCalc(oneDayAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0, today);
        debugCalc(twoDaysAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0, today);

    });

});


