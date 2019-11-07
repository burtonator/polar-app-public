import {assertJSON} from "polar-test/src/test/Assertions";
import {ClozeParser} from "./ClozeParser";

describe('ClozeParser', function() {

    it("toClozeRegions", function () {

        assertJSON(ClozeParser.toClozeRegions('Is Your {{c1::Startup}} Idea Taken?'), [
            {
                "id": 1,
                "occluded": "Startup",
                "offset": 8,
                "length": 15,
                "type": "cloze"
            }
        ]);

        assertJSON(ClozeParser.toClozeRegions('Is Your {{c1::Startup}} Idea Taken?  Not by {{c2::Microsoft}}.'), [
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


    it("toRegions", function () {

        assertJSON(ClozeParser.toRegions('Is Your {{c1::Startup}} Idea Taken?'), [
            {
                "type": "text",
                "subtype": "first",
                "text": "Is Your ",
                "offset": 0,
                "length": 8
            },
            {
                "id": 1,
                "text": "Startup",
                "offset": 8,
                "length": 15,
                "type": "cloze",
                "subtype": "none"
            },
            {
                "type": "text",
                "subtype": "last",
                "text": " Idea Taken?",
                "offset": 23,
                "length": 12
            }
        ]);

        assertJSON(ClozeParser.toRegions('Is Your {{c1::Startup}} Idea Taken?  Not by {{c2::Microsoft}}.'), [
            {
                "type": "text",
                "subtype": "first",
                "text": "Is Your ",
                "offset": 0,
                "length": 8
            },
            {
                "id": 1,
                "text": "Startup",
                "offset": 8,
                "length": 15,
                "type": "cloze",
                "subtype": "none"
            },
            {
                "type": "text",
                "subtype": "mid",
                "text": " Idea Taken?  Not by ",
                "offset": 23,
                "length": 21
            },
            {
                "id": 2,
                "text": "Microsoft",
                "offset": 44,
                "length": 17,
                "type": "cloze",
                "subtype": "none"
            },
            {
                "type": "text",
                "subtype": "last",
                "text": ".",
                "offset": 61,
                "length": 1
            }
        ]);

    });


});





