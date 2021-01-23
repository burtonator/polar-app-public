import {Numbers} from "./Numbers";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('Numbers', function() {

    describe('range', function() {

        it("same value", function() {

            assertJSON([1], Numbers.range(1, 1));

        });

        it("short range", function() {

            assertJSON([0, 1], Numbers.range(0, 1));

        });

        it("large range", function() {

            assertJSON([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Numbers.range(0, 9));

        });

    });

    describe("format", () => {



    });

});
