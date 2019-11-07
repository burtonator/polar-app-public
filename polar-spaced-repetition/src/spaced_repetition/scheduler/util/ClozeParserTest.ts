import {assertJSON} from "polar-test/src/test/Assertions";
import {ClozeParser} from "./ClozeParser";

describe('ClozeParser', function() {

    it("basic", function () {

        assertJSON(ClozeParser.parse('Is Your {{c1::Startup}} Idea Taken?'), [
            {
                "id": 1,
                "occluded": "Startup",
                "offset": 8,
                "length": 15,
                "type": "cloze"
            }
        ]);

        assertJSON(ClozeParser.parse('Is Your {{c1::Startup}} Idea Taken?  Not by {{c2::Microsoft}}.'), [
            {
                "id": 1,
                "occluded": "Startup",
                "offset": 8,
                "length": 15,
                "type": "cloze"
            },
            {
                "id": 2,
                "occluded": "Microsoft",
                "offset": 44,
                "length": 17,
                "type": "cloze"
            }
        ]);

    });

});





