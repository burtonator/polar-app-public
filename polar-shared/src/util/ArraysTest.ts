import {assert} from 'chai';
import {assertJSON} from "polar-test/src/test/Assertions";
import {Arrays} from "./Arrays";

describe('Arrays', function() {

    describe('toDict', function() {

        it("pass it an array", function () {
            assertJSON(Arrays.toDict(["hello"]), { '0': 'hello' })
        });

        it("already a dictionary", function () {
            let expected = {
                "hello": "world"
            };
            assertJSON({hello: "world"}, expected)
        });

        it("failure", function () {
            assert.throws(() => Arrays.toDict(101));
        });

    });

    describe('toArray', function() {

        it("basic", function () {
            assertJSON(Arrays.toArray(null), []);
            assertJSON(Arrays.toArray(undefined), []);
            assertJSON(Arrays.toArray(['hello']), ['hello']);
            assertJSON(Arrays.toArray({1: 'hello'}), ['hello']);
            assertJSON(Arrays.toArray({'1': 'hello'}), ['hello']);
        });

    });

    describe('siblings', function() {

        it("basic", function () {
            assert.isUndefined(Arrays.prevSibling('a', 0))
            assert.equal(Arrays.prevSibling('ab', 1), 'a')
        });

    });


});
