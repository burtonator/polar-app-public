import {AsyncWorkQueues} from './AsyncWorkQueues';
import {assertJSON} from "polar-test/src/test/Assertions";

describe('AsyncWorkQueues', function() {

    describe('awaitPromises', function() {

        it("with no work", async function() {

            await AsyncWorkQueues.awaitAsyncFunctions([]);

        });


        it("with one job", async function() {

            const work = [
                async () => true
            ];

            const results = await AsyncWorkQueues.awaitAsyncFunctions(work);

            assertJSON(results, [true]);

        });

    });

});

