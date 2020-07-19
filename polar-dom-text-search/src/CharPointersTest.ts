import {CharPointers} from "./CharPointers";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('CharPointers', function() {

    it("toArray", function() {
        assertJSON(CharPointers.parse(''), []);
        assertJSON(CharPointers.parse('hello world'), [
            {
                "type": 0,
                "value": "h",
                "offset": 0
            },
            {
                "type": 0,
                "value": "e",
                "offset": 1
            },
            {
                "type": 0,
                "value": "l",
                "offset": 2
            },
            {
                "type": 0,
                "value": "l",
                "offset": 3
            },
            {
                "type": 0,
                "value": "o",
                "offset": 4
            },
            {
                "type": 0,
                "value": " ",
                "offset": 5
            },
            {
                "type": 0,
                "value": "w",
                "offset": 6
            },
            {
                "type": 0,
                "value": "o",
                "offset": 7
            },
            {
                "type": 0,
                "value": "r",
                "offset": 8
            },
            {
                "type": 0,
                "value": "l",
                "offset": 9
            },
            {
                "type": 0,
                "value": "d",
                "offset": 10
            }
        ]);
    });

    it("prefix whitespace", function() {
        assertJSON(CharPointers.parse('  hello world'), [
            {
                "type": 2,
                "value": " ",
                "offset": 0
            },
            {
                "type": 2,
                "value": " ",
                "offset": 1
            },
            {
                "type": 0,
                "value": "h",
                "offset": 2
            },
            {
                "type": 0,
                "value": "e",
                "offset": 3
            },
            {
                "type": 0,
                "value": "l",
                "offset": 4
            },
            {
                "type": 0,
                "value": "l",
                "offset": 5
            },
            {
                "type": 0,
                "value": "o",
                "offset": 6
            },
            {
                "type": 0,
                "value": " ",
                "offset": 7
            },
            {
                "type": 0,
                "value": "w",
                "offset": 8
            },
            {
                "type": 0,
                "value": "o",
                "offset": 9
            },
            {
                "type": 0,
                "value": "r",
                "offset": 10
            },
            {
                "type": 0,
                "value": "l",
                "offset": 11
            },
            {
                "type": 0,
                "value": "d",
                "offset": 12
            }
        ]);
    });


});
