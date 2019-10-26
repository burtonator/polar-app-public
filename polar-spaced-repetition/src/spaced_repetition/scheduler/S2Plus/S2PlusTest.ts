import {expect} from 'chai';
import {Dates} from './Dates';
import {Answer, Rating, S2Plus} from './S2Plus';
import {DEFAULT_DIFFICULTY} from './S2Plus';
import {DEFAULT_INTERVAL} from './S2Plus';
import {Days} from './Dates';
import {Difficulty} from './S2Plus';
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {DateConstants} from "./DateConstants";
import {Preconditions} from "polar-shared/src/Preconditions";

export interface TestRating {

    readonly reviewedAt: ISODateTimeString;
    readonly difficulty: Difficulty;
    readonly interval: Days;

}

/**
 * Like scheduling but the dates are ISO strings for ease of use.
 */
export interface TestScheduling extends TestRating {

    readonly nextReviewDate: ISODateTimeString;

}

interface TestCalculate {
    /**
     * The current time this test is being run.
     */
    readonly timestamp: ISODateTimeString;

    readonly rating: TestRating;

    readonly answer: Answer,

    // FIXME: what fields are shared with the prev object?
    readonly scheduling: TestScheduling,
}

//
// const testData = [
//     {
//         reviewedAt: oneWeekAgo,
//         interval: 7,
//         percentOverdue: 1,
//         recallRate: 0.5,
//     },
//     {
//         reviewedAt: oneWeekAgo,
//         interval: 14,
//         percentOverdue: 0.5,
//         recallRate: 0.71,
//     },
//     {
//         reviewedAt: oneWeekAgo,
//         interval: 1,
//         percentOverdue: 2,
//         recallRate: 0.01,
//     },
//     {
//         reviewedAt: oneDayAgo,
//         interval: 1,
//         percentOverdue: 1,
//         recallRate: 0.5,
//     },
//     {
//         reviewedAt: oneDayAgo,
//         interval: 4,
//         percentOverdue: 0.25,
//         recallRate: 0.85,
//     },
//     {
//         reviewedAt: today,
//         interval: 4,
//         percentOverdue: 0,
//         recallRate: 1,
//     },
// ];
//

//
// const testDataCalculate: ReadonlyArray<TestCalculate> = [
//     {
//         prevReviewedAt: Dates.subtractDays(today, 1),
//         performanceRating: 1,
//         prevDifficulty: 0.5,
//         prevInterval: 1,
//         scheduling: {
//             difficulty: 0.44,
//             interval: 2,
//             nextReviewDate: "2019-10-28T18:19:51.589Z",
//             reviewedAt: "2019-10-26T18:19:29.689Z"
//         },
//     },
//     {
//         prevReviewedAt: Dates.subtractDays(today, 10),
//         performanceRating: 1,
//         prevDifficulty: 0.5,
//         prevInterval: 5,
//         scheduling: {
//             difficulty: 0.38,
//             interval: 20,
//             nextReviewDate: "",
//             reviewedAt: ""
//         },
//     },
//     {
//         prevReviewedAt: Dates.subtractDays(today, 18),
//         performanceRating: 0,
//         prevDifficulty: 0.3,
//         prevInterval: 14,
//         scheduling: {
//             difficulty: 0.91,
//             interval: 14,
//             nextReviewDate: "",
//             reviewedAt: ""
//         },
//     },
//     {
//         prevReviewedAt: Dates.subtractDays(today, 200),
//         performanceRating: 1,
//         prevDifficulty: 0.3,
//         prevInterval: 100,
//         scheduling: {
//             difficulty: 0.18,
//             interval: 400,
//             nextReviewDate: "",
//             reviewedAt: ""
//         }
//     },
// ];


describe("calcRecallRate", () => {

    // it("it should return recall rate", () => {
    //
    //     for (const data of testData) {
    //         const { reviewedAt, interval, recallRate } = data;
    //         const result = S2Plus.calcRecallRate(reviewedAt, interval);
    //         expect(result).to.equal(recallRate);
    //     }
    //
    // });

});

describe("calcPercentOverdue", () => {

    // it("should return the percent overdue for an item reviewed in the past", () => {
    //
    //     for (const data of testData) {
    //         const { reviewedAt, interval, percentOverdue } = data;
    //         console.log("data: ", JSON.stringify(data, null, "  "));
    //
    //         const actual = S2Plus.calcPercentOverdue(reviewedAt, interval);
    //         expect(actual).to.equal(percentOverdue);
    //     }
    //
    // });

    // it("should return a maximum value of 2", () => {
    //     const actual = S2Plus.calcPercentOverdue(oneWeekAgo, 1);
    //     expect(actual).to.equal(2);
    // });

});

describe("calculate", () => {

    beforeEach(function() {
        TestingTime.freeze();
    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    function testCalculations(responses: ReadonlyArray<TestCalculate>) {

        const testDates = DateConstants.create();
        const {today} = testDates;

        for (const response of responses) {

            const { answer, scheduling } = response;

            if (response.timestamp) {
                console.log("Setting time to: " + response.timestamp);
                const epoch = new Date(response.timestamp);
                TestingTime.freeze(epoch);
                Preconditions.assertEqual(new Date().toISOString(),
                                          response.timestamp,
                                          "Unable to freeze at the right time");
            }

            console.log("====" + new Date().toISOString());

            const rating: Rating = {
                reviewedAt: new Date(response.rating.reviewedAt),
                difficulty: response.rating.difficulty,
                interval: response.rating.interval
            };

            const resultScheduling = S2Plus.calculate(rating, answer);
            expect(resultScheduling.reviewedAt.toISOString(), "resultScheduling.reviewedAt").to.equal(response.timestamp);
            expect(resultScheduling.interval, "resultScheduling.interval").to.equal(scheduling.interval);
            expect(resultScheduling.difficulty.toFixed(2), "resultScheduling.difficulty").to.equal(scheduling.difficulty.toFixed(2));
            expect(ISODateTimeStrings.toISODateTimeString(resultScheduling.nextReviewDate), "resultScheduling.nextReviewDate").to.equal(scheduling.nextReviewDate);
            expect(ISODateTimeStrings.toISODateTimeString(resultScheduling.reviewedAt), "resultScheduling.reviewedAt").to.equal(scheduling.reviewedAt);
            console.log("PASSED");

        }

    }
    //
    // it("should calculate the next review data", () => {
    //     testCalculations(testDataCalculate);
    // });

    it("test with all correct answers", () => {
        testCalculations(createTestDataWithAllCorrectAnswers());
    });

    it("should calculate the next review data", () => {

        // const result0 = S2Plus.calculate(reviewedAt, difficulty, interval, performanceRating, today);

    });


    // it("basic", () => {
    //
    //     // TODO: what is difficulty and interval.. ???
    //     //
    //     //  - why is reviewedAt its own value?
    //     //
    //     //  - I think by default we have to have a queue of new cards which do
    //     //    not yet have reviews..
    //
    //     const debugCalc = (reviewedAt: Date,
    //                        prevDifficulty: Difficulty,
    //                        prevInterval: Days,
    //                        performanceRating: number,
    //                        timestamp = new Date()) => {
    //
    //         const result = S2Plus.calculate(reviewedAt, prevDifficulty, prevInterval, performanceRating, timestamp);
    //         console.log(JSON.stringify(result, null, "  "));
    //
    //     };
    //
    //     // const [reviewedAt, difficulty, interval, performanceRating] = [oneDayAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0 ];
    //     debugCalc(oneDayAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0, today);
    //     debugCalc(twoDaysAgo, DEFAULT_DIFFICULTY, DEFAULT_INTERVAL, 1.0, today);
    //
    // });

});

function createTestDataWithAllCorrectAnswers(): ReadonlyArray<TestCalculate> {

    const testDates = DateConstants.create();

    console.log("current time: " + new Date().toISOString());

    return [

        // FIXME: this data is ALL wrong...

        // The difficulty for the first it is set to DEFAULT_DIFFICULTY

        {
            timestamp: '2012-03-02T11:38:49.321Z',
            answer: 1.0,
            // FIXME: this is NOT the rating... this is the PREVIOUS rating!!!
            rating: {
                reviewedAt: "2012-03-01T11:38:49.321Z",
                difficulty: S2Plus.DEFAULT_DIFFICULTY,
                interval: S2Plus.DEFAULT_INTERVAL,
            },
            scheduling: {
                reviewedAt: "2012-03-02T11:38:49.321Z",
                difficulty: 0.24,
                interval: 3,
                nextReviewDate: "2012-03-05T11:38:49.321Z",
            },
        },
        {
            timestamp: "2012-03-05T11:38:49.321Z",
            answer: 1.0,
            rating: {
                reviewedAt: "2012-03-02T11:38:49.321Z",
                difficulty: 0.24,
                interval: 3,
            },
            scheduling: {
                reviewedAt: "2012-03-05T11:38:49.321Z",
                interval: 9,
                difficulty: 0.18,
                nextReviewDate: "2012-03-14T11:38:49.321Z",
            },
        },
        {
            timestamp: "2012-03-14T11:38:49.321Z",
            answer: 1.0,
            rating: {
                reviewedAt: "2012-03-05T11:38:49.321Z",
                interval: 9,
                difficulty: 0.18,
            },
            scheduling: {
                reviewedAt: "2012-03-14T11:38:49.321Z",
                interval: 27,
                difficulty: 0.12,
                nextReviewDate: "2012-04-10T11:38:49.321Z",
            },
        },

    ];

}
