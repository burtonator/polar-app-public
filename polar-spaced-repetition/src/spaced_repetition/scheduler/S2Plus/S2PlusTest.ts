import {S2Plus} from './S2Plus';
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Answer, Days, Difficulty, ReviewState, Schedule} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export interface TestReview {

    readonly reviewedAt: ISODateTimeString;
    readonly difficulty: Difficulty;
    readonly interval: Days;

}

/**
 * Like scheduling but the dates are ISO strings for ease of use.
 */
export interface TestScheduling extends TestReview {

    readonly nextReviewDate: ISODateTimeString;

}

interface TestCalculate {
    /**
     * The current time this test is being run.
     */
    readonly timestamp: ISODateTimeString;

    readonly review: TestReview;

    readonly answer: Answer;

    // FIXME: what fields are shared with the prev object?
    readonly scheduling: TestScheduling;
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

    function testCalculateIter(answers: ReadonlyArray<Answer>,
                               init: ReviewState = {
                                  reviewedAt: "2012-03-01T11:38:49.321Z",
                                  difficulty: S2Plus.DEFAULT_DIFFICULTY,
                                  interval: S2Plus.DEFAULT_INTERVAL,
                               }) {

        let review: ReviewState = init;

        const schedules: Schedule[] = [];

        for (const answer of answers) {

            const schedule = S2Plus.calculate(review, answer);

            schedules.push(schedule);
            TestingTime.freeze(schedule.nextReviewDate);

            review = {
                ...schedule
            };

        }

        return schedules;

    }

    //
    // it("should calculate the next review data", () => {
    //     testCalculations(testDataCalculate);
    // });

    it("test with all correct answers", () => {

        const schedules = testCalculateIter([1, 1, 1]);

        assertJSON(schedules, [
            {
                "difficulty": 0.24117647058823527,
                "interval": "3d",
                "nextReviewDate": "2012-03-05T11:38:49.321Z",
                "reviewedAt": "2012-03-02T11:38:49.321Z"
            },
            {
                "difficulty": 0.18235294117647055,
                "interval": "9d",
                "nextReviewDate": "2012-03-14T11:38:49.321Z",
                "reviewedAt": "2012-03-05T11:38:49.321Z"
            },
            {
                "difficulty": 0.12352941176470585,
                "interval": "27d",
                "nextReviewDate": "2012-04-10T11:38:49.321Z",
                "reviewedAt": "2012-03-14T11:38:49.321Z"
            }
        ]);
    });


    xit("test with all correct answers (long term)", () => {

        const schedules = testCalculateIter([1, 1, 1, 1, 1, 1, 1, 1]);

        console.log(schedules);

    });


    it("test with 2 incorrect", () => {
        const schedules = testCalculateIter([1, 1, 1, 0.0, 0.0]);
        assertJSON(schedules, [
            {
                "difficulty": 0.24117647058823527,
                "interval": "3d",
                "nextReviewDate": "2012-03-05T11:38:49.321Z",
                "reviewedAt": "2012-03-02T11:38:49.321Z"
            },
            {
                "difficulty": 0.18235294117647055,
                "interval": "9d",
                "nextReviewDate": "2012-03-14T11:38:49.321Z",
                "reviewedAt": "2012-03-05T11:38:49.321Z"
            },
            {
                "difficulty": 0.12352941176470585,
                "interval": "27d",
                "nextReviewDate": "2012-04-10T11:38:49.321Z",
                "reviewedAt": "2012-03-14T11:38:49.321Z"
            },
            {
                "difficulty": 0.5941176470588235,
                "interval": "27d",
                "nextReviewDate": "2012-05-07T11:38:49.321Z",
                "reviewedAt": "2012-04-10T11:38:49.321Z"
            },
            {
                "difficulty": 1,
                "interval": "27d",
                "nextReviewDate": "2012-06-03T11:38:49.321Z",
                "reviewedAt": "2012-05-07T11:38:49.321Z"
            }
        ]);
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
