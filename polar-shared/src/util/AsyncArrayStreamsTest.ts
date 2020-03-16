import {assertJSON} from "polar-test/src/test/Assertions";
import {asyncStream} from "./AsyncArrayStreams";

describe('AsyncArrayStreams', function() {

    it("basic (literals)", async function() {
        const collected = await asyncStream([1, 2, 3]).collect();
        assertJSON(collected, [1, 2, 3]);
    });

    it("with async map function", async function() {
        const collected =
            await asyncStream([1, 2, 3])
                .map(async current => current + 1)
                .collect();
        assertJSON(collected, [2, 3, 4]);
    });

    it("with sync map function", async function() {
        const collected =
            await asyncStream([1, 2, 3])
                .map(current => current + 1)
                .collect();
        assertJSON(collected, [2, 3, 4]);
    });

    it("with map and filter function", async function() {
        const collected =
            await asyncStream([1, 2, 3])
                .map(async current => current + 1)
                .filter(async current => current >= 3)
                .collect();
        assertJSON(collected, [3, 4]);
    });

    it("with present only ", async function() {
        const collected =
            await asyncStream([1, null, undefined])
                .present()
                .collect();
        assertJSON(collected, [1]);
    });

});

