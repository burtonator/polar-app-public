import {assert} from 'chai';
import {CharPtrs} from "./CharPtrs";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('CharPtrs', function() {

    it("toArray", function() {

        assertJSON(CharPtrs.toArray(''), []);

        assertJSON(CharPtrs.toArray('hello world'), [
            {
                "value": "h",
                "index": 0,
                "whitespace": false
            },
            {
                "value": "e",
                "index": 1,
                "whitespace": false
            },
            {
                "value": "l",
                "index": 2,
                "whitespace": false
            },
            {
                "value": "l",
                "index": 3,
                "whitespace": false
            },
            {
                "value": "o",
                "index": 4,
                "whitespace": false
            },
            {
                "value": " ",
                "index": 5,
                "whitespace": true
            },
            {
                "value": "w",
                "index": 6,
                "whitespace": false
            },
            {
                "value": "o",
                "index": 7,
                "whitespace": false
            },
            {
                "value": "r",
                "index": 8,
                "whitespace": false
            },
            {
                "value": "l",
                "index": 9,
                "whitespace": false
            },
            {
                "value": "d",
                "index": 10,
                "whitespace": false
            }
        ]);

    });

    it("collapse", function() {

       assertJSON(CharPtrs.collapse('hello    world'), [
           {
               "value": "h",
               "index": 0,
               "whitespace": false
           },
           {
               "value": "e",
               "index": 1,
               "whitespace": false
           },
           {
               "value": "l",
               "index": 2,
               "whitespace": false
           },
           {
               "value": "l",
               "index": 3,
               "whitespace": false
           },
           {
               "value": "o",
               "index": 4,
               "whitespace": false
           },
           {
               "value": " ",
               "index": 8,
               "whitespace": true
           },
           {
               "value": "w",
               "index": 9,
               "whitespace": false
           },
           {
               "value": "o",
               "index": 10,
               "whitespace": false
           },
           {
               "value": "r",
               "index": 11,
               "whitespace": false
           },
           {
               "value": "l",
               "index": 12,
               "whitespace": false
           },
           {
               "value": "d",
               "index": 13,
               "whitespace": false
           }
       ]);

    });

});
