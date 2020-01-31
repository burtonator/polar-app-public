import {assert} from 'chai';
import {SetArrays} from './SetArrays';

describe('SetArrays', function() {

    describe('difference', function() {

        it("Empty sets", function() {

            assert.deepEqual(SetArrays.difference([], []), []);

        });

        it("One element", function() {

            assert.deepEqual(SetArrays.difference(['a'], []), ['a']);

        });

        it("Equivalent", function() {

            assert.deepEqual(SetArrays.difference(['a'], ['a']), []);

        });

        it("Extra", function() {

            assert.deepEqual(SetArrays.difference(['a'], ['a', 'b']), []);

        });

        it("Complex", function () {

            assert.deepEqual(SetArrays.difference(['a', 'b'], ['a']), ['b']);

        });

    });

    describe('union', function() {

        it("duplicates", function () {

            assert.deepEqual(SetArrays.union([1], [1,2]), [1,2]);

        });

    });

    describe('equal', function() {

        it("basic", function () {

            // empty arrays
            assert.ok(SetArrays.equal([], []));

            assert.isFalse(SetArrays.equal([], ['xxx']));

            assert.ok(SetArrays.equal(['y', 'x'], ['x', 'y']));

        });

    });


});
