import {Dictionaries} from './Dictionaries';
import {assert} from 'chai';
import { assertJSON } from 'polar-test/src/test/Assertions';

describe('Dictionaries', function() {

    describe("onlyDefinedProperties", () => {

        it("with array", () => {
            const value = {
                "interval": "1d",
                "intervals": ["4d", "8d"],
                "reviewedAt": "2018-08-22T15:41:42.633Z"
            };

            assertJSON(Dictionaries.onlyDefinedProperties(value), value);
        });

        it("with nested dicts within arrays", () => {

            const value = {
                foo: [
                    {
                        bar: [
                            {
                                dog: 'cat'
                            }
                        ]
                    }
                ]
            };

            assertJSON(Dictionaries.onlyDefinedProperties(value), value);
        });


    });

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

    describe('sorted', function () {

        it('broken array sorting', () => {

            const obj = [
                {
                    "age": 1382400000,
                    "color": "yellow",
                    "created": "2012-02-29T11:38:49.321Z",
                    "id": "101",
                    "stage": "review",
                    "state": {
                        "difficulty": 0.27058823529411763,
                        "interval": "32d",
                        "nextReviewDate": "2012-04-16T11:38:49.321Z",
                        "reviewedAt": "2012-03-15T11:38:49.321Z"
                    },
                    "text": "this is the first one"
                }
            ];
            assertJSON(Dictionaries.sorted(obj), Dictionaries.sorted(obj));

        });

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


    describe("deepCopy", () => {

        it("array array", () => {
            assertJSON(Dictionaries.deepCopy(['one']), ['one']);
        });

        it("nested array", () => {
            assertJSON(Dictionaries.deepCopy({nested: ['one']}), {nested: ['one']});
        });

        it("complex object", () => {
            const value = {
                nested: [
                    'one',
                    {
                        key: 'foo',
                        bar: [
                            1
                        ]
                    }
                ]
            };

            assertJSON(Dictionaries.deepCopy(value), value);
        });

        it("with types", () => {

            interface IFoo {
                readonly bar: string;
            }

            const foo: IFoo = {
                bar: 'hello'
            }

            const newFoo = Dictionaries.deepCopy(foo)

            assert.equal(newFoo.bar, 'hello');
        });


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

