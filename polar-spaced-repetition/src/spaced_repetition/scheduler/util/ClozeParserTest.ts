import {assertJSON} from "polar-test/src/test/Assertions";
import {ClozeParser} from "./ClozeParser";

describe('ClozeParser', function() {

    it("toClozeRegions", function () {

        assertJSON(ClozeParser.toClozeRegions('Is Your {{c1::Startup}} Idea Taken?'), [
            {
                "id": 1,
                "text": "Startup",
                "offset": 8,
                "length": 15,
                "type": "cloze",
                "subtype": "none"
            }
        ]);

        assertJSON(ClozeParser.toClozeRegions('Is Your {{c1::Startup}} Idea Taken?  Not by {{c2::Microsoft}}.'), [
            {
                "id": 1,
                "text": "Startup",
                "offset": 8,
                "length": 15,
                "type": "cloze",
                "subtype": "none"
            },
            {
                "id": 2,
                "text": "Microsoft",
                "offset": 44,
                "length": 17,
                "type": "cloze",
                "subtype": "none"
            }
        ]);

    });


    it("toRegions", function () {

        assertJSON(ClozeParser.toRegions('The capital of california is {{c1::Sacramento}}.'), [
            {
                "type": "text",
                "subtype": "first",
                "text": "The capital of california is ",
                "offset": 0,
                "length": 29
            },
            {
                "id": 1,
                "text": "Sacramento",
                "offset": 29,
                "length": 18,
                "type": "cloze",
                "subtype": "none"
            },
            {
                "type": "text",
                "subtype": "last",
                "text": ".",
                "offset": 47,
                "length": 1
            }
        ]);

        assertJSON(ClozeParser.toRegions(''), [
            {
                "type": "text",
                "subtype": "full",
                "text": "",
                "offset": 0,
                "length": 0
            }
        ]);

        assertJSON(ClozeParser.toRegions('nothing '), [
            {
                "type": "text",
                "subtype": "full",
                "text": "nothing ",
                "offset": 0,
                "length": 8
            }
        ]);

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
        assertJSON(ClozeParser.toRegions('{{c1::Startup}}'), [
            {
                "type": "text",
                "subtype": "first",
                "text": "",
                "offset": 0,
                "length": 0
            },
            {
                "id": 1,
                "text": "Startup",
                "offset": 0,
                "length": 15,
                "type": "cloze",
                "subtype": "none"
            },
            {
                "type": "text",
                "subtype": "last",
                "text": "",
                "offset": 15,
                "length": 0
            }
        ]);
    });


});





