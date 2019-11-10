import {
    createDefaultTaskRepResolver,
    OptionalTaskRepResolver,
    ReadingTaskAction,
    TaskRepResolver,
    TasksCalculator
} from "./TasksCalculator";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {assertJSON} from "polar-test/src/test/Assertions";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {DurationStr, TimeDurations} from "polar-shared/src/util/TimeDurations";
import {ISpacedRep, Rating, Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";


async function doTest(potential: ReadonlyArray<Task<ReadingTaskAction>>, workMap: PendingTaskRepMap = {}) {

    const resolver = createMockWorkRepResolver(workMap);

    return await TasksCalculator.calculate({
        potential,
        resolver,
        limit: 10
    });

}

interface TasksTestAssertion {
    readonly tasks: any;
}

interface NextTestAssertion {
    readonly next: any;
}

type TestAssertion = TasksTestAssertion | NextTestAssertion;

class Tester {

    public pendingTaskRepMap: PendingTaskRepMap = {};

    public step: number = 0;

    public potential: ReadonlyArray<Task<ReadingTaskAction>>;

    constructor(public readonly task: Task<ReadingTaskAction>) {
        this.potential = [task];
    }

    public async doStep(timeForward: DurationStr = '0h',
                        rating: Rating = 'good',
                        assertions?: ReadonlyArray<TestAssertion>) {

        TestingTime.forward(TimeDurations.toMillis(timeForward));

        console.log("==== Doing step " + this.step);

        const calculatedTaskReps = await doTest(this.potential, this.pendingTaskRepMap);
        const {taskReps} = calculatedTaskReps;

        console.log("tasks: " + Dictionaries.toJSON(taskReps));

        const computeNext = () => {

            if (taskReps.length === 0) {
                return undefined;
            }

            const next = TasksCalculator.computeNextSpacedRep(taskReps[0], rating);

            console.log("next: " + Dictionaries.toJSON(next));

            return next;

        };

        const next = computeNext();

        if (assertions) {

            for (const assertion of assertions) {

                if ((<any> assertion).tasks) {
                    const tasksTestAssertion = <TasksTestAssertion> assertion;
                    assertJSON(Dictionaries.sorted(taskReps), Dictionaries.sorted(tasksTestAssertion.tasks));
                    console.log("tasks test assertion passed");
                }

                if ((<any> assertion).next) {
                    const nextTestAssertion = <NextTestAssertion> assertion;
                    assertJSON(Dictionaries.sorted(next), Dictionaries.sorted(nextTestAssertion.next));
                    console.log("next test assertion passed");
                }

            }

        }

        if (next) {
            const pendingTaskRep: PendingTaskRep = {action: this.task, spacedRep: next};
            this.pendingTaskRepMap[next.id] = pendingTaskRep;
        }

        ++this.step;

    };

}

describe("TasksCalculator", () => {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.freeze();
    });

    it("with no items", async () => {

        const potential: ReadonlyArray<Task<ReadingTaskAction>> = [

        ];

        const tasks = await doTest(potential);

        assertJSON(tasks, []);

    });

    it("with all new items but not ready to use as they haven't expired yet.", async () => {

        const potential: ReadonlyArray<Task<ReadingTaskAction>> = [
            {
                id: "101",
                action: 'this is the first one',
                created: ISODateTimeStrings.create(),
                color: 'yellow',
                mode: 'reading'
            }
        ];

        const tasks = await doTest(potential);

        assertJSON(tasks, []);

    });

    it("learning: again on last iteration so we jump back", async () => {

        const twoDaysAgo = TimeDurations.compute('-2d');

        const task: Task<ReadingTaskAction> = {
            id: "101",
            action: 'this is the first one',
            created: twoDaysAgo.toISOString(),
            color: 'yellow',
            mode: 'reading'
        };

        const tester = new Tester(task);

        await tester.doStep( '0h', 'good', [
            {
                next: {
                    "id": "101",
                    "stage": "learning",
                    "state": {
                        "interval": "4d",
                        "intervals": [
                            "8d"
                        ],
                        "reviewedAt": "2012-03-02T11:38:49.321Z"
                    }
                }
            },
            {
                tasks: [
                    {
                        "id": "101",
                        "action": "this is the first one",
                        "created": "2012-02-29T11:38:49.321Z",
                        "color": "yellow",
                        "age": 86400000,
                        "mode": "reading",
                        "stage": "learning",
                        "state": {
                            "reviewedAt": "2012-02-29T11:38:49.321Z",
                            "interval": "1d",
                            "intervals": [
                                "4d",
                                "8d"
                            ]
                        }
                    }
                ]
            }
        ]);

        await tester.doStep('1d', 'good',
            [
                {
                    next: {
                        "id": "101",
                        "stage": "learning",
                        "state": {
                            "interval": "8d",
                            "intervals": [],
                            "reviewedAt": "2012-03-03T11:38:49.321Z"
                        }
                    }
                },
                {
                    tasks: [
                        {
                            "age": 86400000,
                            "color": "yellow",
                            "created": "2012-02-29T11:38:49.321Z",
                            "id": "101",
                            "mode": "reading",
                            "stage": "learning",
                            "state": {
                                "interval": "4d",
                                "intervals": [
                                    "8d"
                                ],
                                "reviewedAt": "2012-03-02T11:38:49.321Z"
                            },
                            "action": "this is the first one"
                        }
                    ]
                }
            ]);

        await tester.doStep('8d', 'again',
            [
                {
                    next: {
                        "id": "101",
                        "stage": "learning",
                        "state": {
                            "interval": "1d",
                            "intervals": [
                                "4d",
                                "8d"
                            ],
                            "reviewedAt": "2012-03-11T11:38:49.321Z"
                        }
                    }
                },
                {
                    tasks: [
                        {
                            "age": 691200000,
                            "color": "yellow",
                            "created": "2012-02-29T11:38:49.321Z",
                            "id": "101",
                            "mode": "reading",
                            "stage": "learning",
                            "state": {
                                "interval": "8d",
                                "intervals": [],
                                "reviewedAt": "2012-03-03T11:38:49.321Z"
                            },
                            "action": "this is the first one"
                        }
                    ]
                }
            ]);

    });


    it("learning: first iteration is easy so jump right to review", async () => {

        const twoDaysAgo = TimeDurations.compute('-2d');

        const task: Task<ReadingTaskAction> = {
            id: "101",
            action: 'this is the first one',
            created: twoDaysAgo.toISOString(),
            color: 'yellow',
            mode: 'reading'
        };

        const tester = new Tester(task);

        const expectedTasks = [
            {
                "id": "101",
                "action": "this is the first one",
                "created": "2012-02-29T11:38:49.321Z",
                "color": "yellow",
                "age": 86400000,
                "mode": "reading",
                "stage": "learning",
                "state": {
                    "reviewedAt": "2012-02-29T11:38:49.321Z",
                    "interval": "1d",
                    "intervals": [
                        "4d",
                        "8d"
                    ]
                }
            }
        ];

        const expectedNext = {
            "id": "101",
            "stage": "review",
            "state": {
                "difficulty": 0.3,
                "interval": "16d",
                "reviewedAt": "2012-03-02T11:38:49.321Z"
            }
        };

        await tester.doStep('0h', 'easy', [
            {next: expectedNext},
            {tasks: expectedTasks}
        ]);

    });

    it("learning: first trigger 'again' so we schedule it for an hour from now", async () => {

        const twoDaysAgo = TimeDurations.compute('-2d');

        const task: Task<ReadingTaskAction> = {
            id: "101",
            action: 'this is the first one',
            created: twoDaysAgo.toISOString(),
            color: 'yellow',
            mode: 'reading'
        };

        const tester = new Tester(task);

        console.log("====== Date is now: " + new Date().toISOString());

        await tester.doStep('0h', 'again', [
            {
                next: {
                    "id": "101",
                    "stage": "learning",
                    "state": {
                        "interval": "1d",
                        "intervals": [
                            "4d",
                            "8d"
                        ],
                        "reviewedAt": "2012-03-02T11:38:49.321Z"
                    }
                }
            }
        ]);

        console.log("====== Date is now: " + new Date().toISOString());

        await tester.doStep('0h', 'again', [
            {
                tasks: []
            }
        ]);

        await tester.doStep('1d', 'again', [
            {
                tasks: [
                    {
                        "age": 86400000,
                        "color": "yellow",
                        "created": "2012-02-29T11:38:49.321Z",
                        "id": "101",
                        "mode": "reading",
                        "stage": "learning",
                        "state": {
                            "interval": "1d",
                            "intervals": [
                                "4d",
                                "8d"
                            ],
                            "reviewedAt": "2012-03-02T11:38:49.321Z"
                        },
                        "action": "this is the first one"
                    }
                ]
            }
        ]);


    });


    it("review: compute lapsed and verify we restore the right new interval", async () => {

        const twoDaysAgo = TimeDurations.compute('-2d');

        const task: Task<ReadingTaskAction> = {
            id: "101",
            action: 'this is the first one',
            created: twoDaysAgo.toISOString(),
            color: 'yellow',
            mode: 'reading'
        };

        const tester = new Tester(task);

        await tester.doStep('0h', 'good');

        await tester.doStep('1d', 'good');

        await tester.doStep('4d', 'good', [
            {
                next: {
                    "id": "101",
                    "stage": "review",
                    "state": {
                        "difficulty": 0.3,
                        "interval": "16d",
                        "reviewedAt": "2012-03-07T11:38:49.321Z"
                    }
                }
            }
        ]);

        // we should lapse now
        await tester.doStep('8d', 'again', [
            {
                next: {
                    "id": "101",
                    "lapses": 1,
                    "stage": "lapsed",
                    "state": {
                        "interval": "1d",
                        "reviewState": {
                            "difficulty": 0.3,
                            "interval": "16d",
                            "reviewedAt": "2012-03-07T11:38:49.321Z"
                        },
                        "reviewedAt": "2012-03-15T11:38:49.321Z"
                    }
                }
            }
        ]);

        await tester.doStep('1d', 'good', [
            {
                next: {
                    "id": "101",
                    "lapses": 1,
                    "stage": "review",
                    "state": {
                        "difficulty": 0.34136029411764707,
                        "interval": 345600000,
                        "reviewedAt": "2012-03-16T11:38:49.321Z"
                    }
                }
            }
        ]);

    });

    it("compute walk through of each stage", async () => {

        const twoDaysAgo = TimeDurations.compute('-2d');

        const task: Task<ReadingTaskAction> = {
            id: "101",
            action: 'this is the first one',
            created: twoDaysAgo.toISOString(),
            color: 'yellow',
            mode: 'reading'
        };

        const tester = new Tester(task);

        await tester.doStep('0h', 'good', [
            {
                tasks: [
                    {
                        "id": "101",
                        "action": "this is the first one",
                        "created": "2012-02-29T11:38:49.321Z",
                        "color": "yellow",
                        "age": 86400000,
                        "mode": "reading",
                        "stage": "learning",
                        "state": {
                            "reviewedAt": "2012-02-29T11:38:49.321Z",
                            "interval": "1d",
                            "intervals": [
                                "4d",
                                "8d"
                            ]
                        }
                    }
                ]
            }
        ]);

        await tester.doStep('1d', 'good', [
            {
                tasks: [
                    {
                        "id": "101",
                        "action": "this is the first one",
                        "created": "2012-02-29T11:38:49.321Z",
                        "color": "yellow",
                        "mode": "reading",
                        "stage": "learning",
                        "state": {
                            "reviewedAt": "2012-03-02T11:38:49.321Z",
                            "intervals": [
                                "8d"
                            ],
                            "interval": "4d"
                        },
                        "age": 86400000
                    }
                ]
            }
        ]);

        await tester.doStep('4d', 'good', [
            {
                tasks: [
                    {
                        "id": "101",
                        "action": "this is the first one",
                        "created": "2012-02-29T11:38:49.321Z",
                        "color": "yellow",
                        "mode": "reading",
                        "stage": "learning",
                        "state": {
                            "reviewedAt": "2012-03-03T11:38:49.321Z",
                            "intervals": [],
                            "interval": "8d"
                        },
                        "age": 345600000
                    }
                ]
            }
        ]);

        await tester.doStep('8d', 'good', [
            {
                tasks: [
                    {
                        "id": "101",
                        "action": "this is the first one",
                        "created": "2012-02-29T11:38:49.321Z",
                        "color": "yellow",
                        "mode": "reading",
                        "stage": "review",
                        "state": {
                            "reviewedAt": "2012-03-07T11:38:49.321Z",
                            "difficulty": 0.3,
                            "interval": "16d"
                        },
                        "age": 691200000
                    }
                ]
            }
        ]);

        await tester.doStep('16d', 'good', [
            {
                tasks: [
                    {
                        "id": "101",
                        "action": "this is the first one",
                        "created": "2012-02-29T11:38:49.321Z",
                        "color": "yellow",
                        "mode": "reading",
                        "stage": "review",
                        "state": {
                            "difficulty": 0.3367647058823529,
                            "interval": "32d",
                            "nextReviewDate": "2012-04-16T11:38:49.321Z",
                            "reviewedAt": "2012-03-15T11:38:49.321Z"
                        },
                        "age": 1382400000
                    }
                ]
            }
        ]);

    });

});

export interface PendingTaskRep {
    readonly action: Task<ReadingTaskAction>;
    readonly spacedRep: ISpacedRep;
}

export type PendingTaskRepMap = {[id: string]: PendingTaskRep};

function createMockWorkRepResolver(pendingTaskRepMap: PendingTaskRepMap = {}): TaskRepResolver<ReadingTaskAction> {

    const optionalTaskRepResolver: OptionalTaskRepResolver<ReadingTaskAction> = async (task: Task<ReadingTaskAction>) => {

        const pendingWorkRep = Optional.of(pendingTaskRepMap[task.id]).getOrUndefined();

        if (pendingWorkRep) {
            const age = TasksCalculator.computeAge(pendingWorkRep.spacedRep);
            return {...pendingWorkRep.action, ...pendingWorkRep.spacedRep, age};
        }

        return undefined;

    };

    return createDefaultTaskRepResolver<string>(optionalTaskRepResolver)

}

