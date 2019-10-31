import {
    createDefaultWorkRepResolver,
    OptionalWorkRepResolver,
    Work,
    WorkCalculator,
    WorkRep,
    WorkRepResolver
} from "./WorkCalculator";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {assertJSON} from "polar-test/src/test/Assertions";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {TimeDurations} from "polar-shared/src/util/TimeDurations";

describe("WorkCalculator", () => {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.freeze();
    });

    async function doTest(potential: ReadonlyArray<Work>) {
        const resolver = createMockWorkRepResolver();

        const tasks = await WorkCalculator.calculate({
            potential,
            resolver,
            limit: 10
        });

        return tasks;

    }

    it("with no items", async () => {

        const potential: ReadonlyArray<Work> = [

        ];

        const tasks = await doTest(potential);

        assertJSON(tasks, []);

    });

    it("with all new items but not ready to use as they haven't expired yet.", async () => {

        const potential: ReadonlyArray<Work> = [
            {
                id: "101",
                text: 'this is the first one',
                created: ISODateTimeStrings.create(),
                color: 'yellow'
            }
        ];

        const tasks = await doTest(potential);

        assertJSON(tasks, []);

    });

    it("with all new items but not ready to use as they haven't expired yet.", async () => {

        const twoDaysAgo = TimeDurations.compute('-2d');

        const potential: ReadonlyArray<Work> = [
            {
                id: "101",
                text: 'this is the first one',
                created: twoDaysAgo.toISOString(),
                color: 'yellow'
            }
        ];

        const tasks = await doTest(potential);

        assertJSON(tasks, [
            {
                "id": "101",
                "text": "this is the first one",
                "created": "2012-02-29T11:38:49.321Z",
                "color": "yellow",
                "age": 86400000,
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
        ]);

    });


});

function createMockWorkRepResolver(map: WorkMap = {}): WorkRepResolver {

    const optionalWorkRepResolver: OptionalWorkRepResolver = async (work: Work) => {
        return Optional.of(map[work.id]).getOrUndefined();
    };

    return createDefaultWorkRepResolver(optionalWorkRepResolver)

}

export type WorkMap = {[id: string]: WorkRep};
