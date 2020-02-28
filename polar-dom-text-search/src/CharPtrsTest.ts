import {assert} from 'chai';
import {CharPtrs} from "./CharPtrs";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('CharPtrs', function() {

    it("toArray", function() {

        assertJSON(CharPtrs.toArray(''), []);

        assertJSON(CharPtrs.toArray('hello world'), [
            {
                "value": "h",
                "offset": 0,
                "whitespace": false
            },
            {
                "value": "e",
                "offset": 1,
                "whitespace": false
            },
            {
                "value": "l",
                "offset": 2,
                "whitespace": false
            },
            {
                "value": "l",
                "offset": 3,
                "whitespace": false
            },
            {
                "value": "o",
                "offset": 4,
                "whitespace": false
            },
            {
                "value": " ",
                "offset": 5,
                "whitespace": true
            },
            {
                "value": "w",
                "offset": 6,
                "whitespace": false
            },
            {
                "value": "o",
                "offset": 7,
                "whitespace": false
            },
            {
                "value": "r",
                "offset": 8,
                "whitespace": false
            },
            {
                "value": "l",
                "offset": 9,
                "whitespace": false
            },
            {
                "value": "d",
                "offset": 10,
                "whitespace": false
            }
        ]);

    });

    it("collapse", function() {

       assertJSON(CharPtrs.collapse('hello    world'), [
           {
               "value": "h",
               "offset": 0,
               "whitespace": false
           },
           {
               "value": "e",
               "offset": 1,
               "whitespace": false
           },
           {
               "value": "l",
               "offset": 2,
               "whitespace": false
           },
           {
               "value": "l",
               "offset": 3,
               "whitespace": false
           },
           {
               "value": "o",
               "offset": 4,
               "whitespace": false
           },
           {
               "value": " ",
               "offset": 8,
               "whitespace": true
           },
           {
               "value": "w",
               "offset": 9,
               "whitespace": false
           },
           {
               "value": "o",
               "offset": 10,
               "whitespace": false
           },
           {
               "value": "r",
               "offset": 11,
               "whitespace": false
           },
           {
               "value": "l",
               "offset": 12,
               "whitespace": false
           },
           {
               "value": "d",
               "offset": 13,
               "whitespace": false
           }
       ]);

    });

});
