import {Numbers} from "./Numbers";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Bytes} from "./Bytes";
import {assert} from 'chai';

describe('Bytes', function() {

    describe("format", () => {

        it("500GB", () => {
            assert.equal(Bytes.format(500000000000), "500 GB");
        });

    });

});
