import {assert} from 'chai';
import {Reducers} from './Reducers';
import {assertJSON} from "polar-test/src/test/Assertions";

describe('Reducers', function() {

    describe('sum', function() {

        it("basic", async function () {
            assert.equal([100].reduce(Reducers.SUM), 100);
        });

        it("none", async function () {
            assert.equal([].reduce(Reducers.SUM, 0), 0);
        });

    });

    describe('LAST', function() {

        // it("no values", async function() {
        //     const arr: number[] = [];
        //     const val = arr.reduce(Reducers.LAST, undefined);
        //     assert.equal(val, undefined);
        // });

        it("two values", async function() {
            assert.equal([0, 1].reduce(Reducers.LAST), 1);
        });

        it("one value", async function() {
            assert.equal([0].reduce(Reducers.LAST), 0);
        });

        it("none", async function() {
            assert.equal([undefined, null].reduce(Reducers.LAST), undefined);
        });

        it("all null values", async function () {
            assert.ok([null, null, null].reduce(Reducers.LAST) === null);
        });

        it("all undefined", async function () {
            assert.ok(typeof [null, null, undefined].reduce(Reducers.LAST) === "undefined");
        });

        it("with default", async function () {
            assert.ok(["alice", "bob"].reduce(Reducers.LAST, "carol") === "bob");
        });

        it("with default and no entries", async function () {
            assert.ok([].reduce(Reducers.LAST, "carol") === "carol");
        });

    });


    describe('FIRST', function() {

        // [].reduce()

        // FIXME: ok, this is all fucked because I can give the INITIAL value
        // to the reducer but not a DEFAULT value to return if the array is
        // empty and the reducer is NEVER called if there are no values and TS
        //

        it("basic", async function () {
            assert.equal([0, 1, 2, 3].reduce(Reducers.FIRST), 0);
        });

        it("one value", async function () {
            assert.equal([0].reduce(Reducers.FIRST), 0);
        });

        it("none", async function () {
            assert.equal([undefined, null].reduce(Reducers.FIRST), undefined);
        });

        it("none with default and one entry", async function () {
            assert.equal(['a'].reduce(Reducers.FIRST, 'carol'), 'a');
        });

        it("none with default and no entries", async function () {
            assert.equal([].reduce(Reducers.FIRST, 'carol'), 'carol');
        });

        it("all null values", async function () {
            assert.ok([null, null, null].reduce(Reducers.FIRST) === null);
        });

        it("all undefined", async function () {
            assert.ok(typeof [undefined, null, null].reduce(Reducers.FIRST) === "undefined");
        });

        it("empty", async function () {
            assert.equal([].reduce(Reducers.MIN, 0), 0);
            assertJSON([].reduce(Reducers.FLAT, []), []);
        });

    });

    describe('FLAT', function() {

        // [].reduce()

        // FIXME: ok, this is all fucked because I can give the INITIAL value
        // to the reducer but not a DEFAULT value to return if the array is
        // empty and the reducer is NEVER called if there are no values and TS
        //

        it("basic", async function () {
            const result = [[1, 2],[3, 4]].reduce(Reducers.FLAT);
            assertJSON(result, [1, 2, 3, 4]);
        });

    });



});
