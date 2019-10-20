import {Dictionaries} from './Dictionaries';
import {assert} from 'chai';
import { assertJSON } from 'polar-test/src/test/Assertions';

describe('Dictionaries', function() {

    it("numberKeys", async function () {

        const dict: {[key: number]: string} = {
            1: 'foo'
        };

        assert.equal(dict[1], 'foo');

        const keys = Dictionaries.numberKeys(dict)

        assert.equal(typeof keys[0] , 'number');


        assert.equal(dict[keys[0]] , 'foo');
        assertJSON(keys, [1]);

    });


    it("basic", async function () {

        const dict = {
            'z': 1,
            'a': 2
        };

        const expected = {
            "a": 2,
            "z": 1
        };

        assertJSON(Dictionaries.sorted(dict), expected);

    });

    it("with nulls and undefined", async function() {

        const dict = {
            'z': null,
            'a': undefined
        };

        const expected = {
            "z": null
        };

        assertJSON(Dictionaries.sorted(dict), expected);

    });

    it("nested", async function() {

        const dict = {
            z: 1,
            a: 2,
            nested: {
                'z': 1,
                'a': 2
            }
        };

        const expected = {
            "a": 2,
            "nested": {
                "a": 2,
                "z": 1
            },
            "z": 1
        };

        assertJSON(Dictionaries.sorted(dict), expected);

    });


    it("dict with internal array", async function() {

        const dict = {
            arr: [
                1, 2, 3
            ]
        };

        const expected = {
            arr: [
                1,
                2,
                3
            ]
        };

        assertJSON(Dictionaries.sorted(dict), expected);

    });


    it("raw array", async function() {

        assertJSON(Dictionaries.sorted([1, 2, 3]), [1, 2, 3]);

    });

    // it("toDict", function() {
    //
    //     interface Name {
    //         first: string;
    //         last: string;
    //     }
    //
    //     const names: Name[] = [
    //         { first: 'alice', last: 'smith' },
    //         { first: 'bob', last: 'smith' },
    //     ];
    //
    //     _.chain(names)
    //         .reduce((accumulator: any, value: any, initial: any) => {
    //         console.log("here");
    //     }).value();
    //
    // });

});

