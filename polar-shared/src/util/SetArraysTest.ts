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

        it("production test", function () {

            const currentAnnotationsIDs = [
                "14SqXCxSH7",
                "1u6HgNYwi1",
                "12ei8khyNG",
                "12ix7CTNgt"
            ];

            const newAnnotationIDs = [
                "14SqXCxSH7",
                "1u6HgNYwi1",
                "12ei8khyNG"
            ];

            const deleteIDs = SetArrays.difference(currentAnnotationsIDs, newAnnotationIDs);

            assert.equal(deleteIDs.length, 1);
            assert.equal(deleteIDs[0], '12ix7CTNgt');

        });

    });

    describe('union', function() {

        it("duplicates", function () {

            assert.deepEqual(SetArrays.union([1], [1, 2]), [1, 2]);

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
