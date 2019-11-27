import {assert} from 'chai';
import {
    createDefaultTaskRepResolver,
    OptionalTaskRepResolver,
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

type TestTaskAction = string;

async function doTest(potential: ReadonlyArray<Task<TestTaskAction>>, workMap: PendingTaskRepMap = {}) {

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

    public potential: ReadonlyArray<Task<TestTaskAction>>;

    constructor(public readonly task: Task<TestTaskAction>) {
        this.potential = [task];
    }

    public async doStep(timeForward: DurationStr = '0h',
                        rating: Rating = 'good',
                        assertions?: ReadonlyArray<TestAssertion>) {

        TestingTime.forward(TimeDurations.toMillis(timeForward));

        console.log("==== Doing step " + this.step + " at " + ISODateTimeStrings.create());

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

    }

}

describe("TasksCalculator", () => {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.freeze();
    });

    it("with no items", async () => {

        const potential: ReadonlyArray<Task<TestTaskAction>> = [

        ];

        const tasks = await doTest(potential);

        assertJSON(tasks, {
            "stageCounts": {
                "nrLapsed": 0,
                "nrLearning": 0,
                "nrNew": 0,
                "nrReview": 0
            },
            "taskReps": []
        });

    });

    it("with all new items but not ready to use as they haven't expired yet.", async () => {

        const potential: ReadonlyArray<Task<TestTaskAction>> = [
            {
                id: "101",
                action: 'this is the first one',
                created: ISODateTimeStrings.create(),
                color: 'yellow',
                mode: 'reading'
            }
        ];

        const tasks = await doTest(potential);

        assertJSON(tasks, {
            "stageCounts": {
                "nrLapsed": 0,
                "nrLearning": 0,
                "nrNew": 0,
                "nrReview": 0
            },
            "taskReps": []
        });

    });

    it("learning: again on last iteration so we jump back", async () => {

        const twoDaysAgo = TimeDurations.compute('-2d');

        const task: Task<TestTaskAction> = {
            id: "101",
            action: 'this is the first one',
            created: ISODateTimeStrings.create(),
            color: 'yellow',
            mode: 'reading'
        };

        assert.equal(task.created, "2012-03-02T11:38:49.321Z");

        const tester = new Tester(task);

        await tester.doStep( '1d', 'good', [
            {
                next: {
                    "id": "101",
                    "stage": "learning",
                    "state": {
                        "interval": "4d",
                        "intervals": [
                            "8d"
                        ],
                        "reviewedAt": "2012-03-03T11:38:49.321Z"
                    }
                }
            },
            {
                tasks: [
                    {
                        "id": "101",
                        "action": "this is the first one",
                        "created": "2012-03-02T11:38:49.321Z",
                        "color": "yellow",
                        "age": 0,
                        "mode": "reading",
                        "stage": "learning",
                        "state": {
                            "reviewedAt": "2012-03-02T11:38:49.321Z",
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

        await tester.doStep('4d', 'good',
            [
                {
                    next: {
                        "id": "101",
                        "stage": "learning",
                        "state": {
                            "interval": "8d",
                            "intervals": [],
                            "reviewedAt": "2012-03-07T11:38:49.321Z"
                        }
                    }
                },
                {
                    tasks: [
                        {
                            "age": 0,
                            "color": "yellow",
                            "created": "2012-03-02T11:38:49.321Z",
                            "id": "101",
                            "mode": "reading",
                            "stage": "learning",
                            "state": {
                                "interval": "4d",
                                "intervals": [
                                    "8d"
                                ],
                                "reviewedAt": "2012-03-03T11:38:49.321Z"
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
                            "reviewedAt": "2012-03-15T11:38:49.321Z"
                        }
                    }
                },
                {
                    tasks: [
                        {
                            "age": 0,
                            "color": "yellow",
                            "created": "2012-03-02T11:38:49.321Z",
                            "id": "101",
                            "mode": "reading",
                            "stage": "learning",
                            "state": {
                                "interval": "8d",
                                "intervals": [],
                                "reviewedAt": "2012-03-07T11:38:49.321Z"
                            },
                            "action": "this is the first one"
                        }
                    ]
                }
            ]);

    });


    it("learning: first iteration is easy so jump right to review", async () => {

        const twoDaysAgo = TimeDurations.compute('-2d');

        const task: Task<TestTaskAction> = {
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

        const task: Task<TestTaskAction> = {
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
                        "age": 0,
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

        const task: Task<TestTaskAction> = {
            id: "101",
            action: 'this is the first one',
            created: ISODateTimeStrings.create(),
            color: 'yellow',
            mode: 'reading'
        };

        const tester = new Tester(task);

        await tester.doStep('1d', 'good');

        await tester.doStep('4d', 'good');

        await tester.doStep('8d', 'good', [
            {
                next: {
                    "id": "101",
                    "stage": "review",
                    "state": {
                        "difficulty": 0.3,
                        "interval": "16d",
                        "reviewedAt": "2012-03-15T11:38:49.321Z"
                    }
                }
            }
        ]);

        // we should lapse now
        await tester.doStep('16d', 'again', [
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
                            "reviewedAt": "2012-03-15T11:38:49.321Z"
                        },
                        "reviewedAt": "2012-03-31T11:38:49.321Z"
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
                        "difficulty": 0.378125,
                        "interval": 345600000,
                        "reviewedAt": "2012-04-01T11:38:49.321Z"
                    }
                }
            }
        ]);

    });

    it("compute walk through of each stage", async () => {

        const task: Task<TestTaskAction> = {
            id: "101",
            action: 'this is the first one',
            created: ISODateTimeStrings.create(),
            color: 'yellow',
            mode: 'reading'
        };

        const tester = new Tester(task);

        await tester.doStep('1d', 'good', [
            {
                tasks: [
                    {
                        "action": "this is the first one",
                        "age": 0,
                        "color": "yellow",
                        "created": "2012-03-02T11:38:49.321Z",
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
                        }
                    }
                ]
            }
        ]);

        await tester.doStep('4d', 'good', [
            {
                tasks: [
                    {
                        "action": "this is the first one",
                        "age": 0,
                        "color": "yellow",
                        "created": "2012-03-02T11:38:49.321Z",
                        "id": "101",
                        "mode": "reading",
                        "stage": "learning",
                        "state": {
                            "interval": "4d",
                            "intervals": [
                                "8d"
                            ],
                            "reviewedAt": "2012-03-03T11:38:49.321Z"
                        }
                    }
                ]
            }
        ]);

        await tester.doStep('8d', 'good', [
            {
                next: {
                    "id": "101",
                    "stage": "review",
                    "state": {
                        "difficulty": 0.3,
                        "interval": "16d",
                        "reviewedAt": "2012-03-15T11:38:49.321Z"
                    }
                }
            },
            {
                tasks: [
                    {
                        "action": "this is the first one",
                        "age": 0,
                        "color": "yellow",
                        "created": "2012-03-02T11:38:49.321Z",
                        "id": "101",
                        "mode": "reading",
                        "stage": "learning",
                        "state": {
                            "interval": "8d",
                            "intervals": [],
                            "reviewedAt": "2012-03-07T11:38:49.321Z"
                        }
                    }
                ]
            }
        ]);

        await tester.doStep('16d', 'good', [
            {
                next: {
                    "id": "101",
                    "stage": "review",
                    "state": {
                        "difficulty": 0.3735294117647059,
                        "interval": "32d",
                        "nextReviewDate": "2012-05-02T11:38:49.321Z",
                        "reviewedAt": "2012-03-31T11:38:49.321Z"
                    }
                }
            },
            {
                tasks: [
                    {
                        "action": "this is the first one",
                        "age": 0,
                        "color": "yellow",
                        "created": "2012-03-02T11:38:49.321Z",
                        "id": "101",
                        "mode": "reading",
                        "stage": "review",
                        "state": {
                            "difficulty": 0.3,
                            "interval": "16d",
                            "reviewedAt": "2012-03-15T11:38:49.321Z"
                        }
                    }
                ]
            }
        ]);

        await tester.doStep('32d', 'good', [
            {
                tasks: [
                    {
                        "action": "this is the first one",
                        "age": 0,
                        "color": "yellow",
                        "created": "2012-03-02T11:38:49.321Z",
                        "id": "101",
                        "mode": "reading",
                        "stage": "review",
                        "state": {
                            "difficulty": 0.3735294117647059,
                            "interval": "32d",
                            "nextReviewDate": "2012-05-02T11:38:49.321Z",
                            "reviewedAt": "2012-03-31T11:38:49.321Z"
                        }
                    }
                ]
            }
        ]);

    });

});

export interface PendingTaskRep {
    readonly action: Task<TestTaskAction>;
    readonly spacedRep: ISpacedRep;
}

export interface PendingTaskRepMap {
    [id: string]: PendingTaskRep;
}

function createMockWorkRepResolver(pendingTaskRepMap: PendingTaskRepMap = {}): TaskRepResolver<TestTaskAction> {

    const optionalTaskRepResolver: OptionalTaskRepResolver<TestTaskAction> = async (task: Task<TestTaskAction>) => {

        const pendingWorkRep = Optional.of(pendingTaskRepMap[task.id]).getOrUndefined();

        if (pendingWorkRep) {
            const age = TasksCalculator.computeAge(pendingWorkRep.spacedRep);
            return {...pendingWorkRep.action, ...pendingWorkRep.spacedRep, age};
        }

        return undefined;

    };

    return createDefaultTaskRepResolver<string>(optionalTaskRepResolver);

}

