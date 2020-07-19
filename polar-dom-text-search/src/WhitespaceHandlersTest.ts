import {assert} from 'chai';
import {WhitespaceHandlers} from "./WhitespaceHandlers";
import { assertJSON } from 'polar-test/src/test/Assertions';

describe('WhitespaceHandlers', function() {

    describe('computeWhitespaceTerminator', function() {

        it("basic", function() {

            assert.isUndefined(WhitespaceHandlers.computeWhitespaceTerminator('', 'start'));
            assert.isUndefined(WhitespaceHandlers.computeWhitespaceTerminator('', 'end'));

            assert.equal(0, WhitespaceHandlers.computeWhitespaceTerminator('hello', 'start'));
            assert.equal(1, WhitespaceHandlers.computeWhitespaceTerminator(' hello ', 'start'));
            assert.equal(2, WhitespaceHandlers.computeWhitespaceTerminator('  hello  ', 'start'));

            assert.equal(4, WhitespaceHandlers.computeWhitespaceTerminator('hello', 'end'));
            assert.equal(5, WhitespaceHandlers.computeWhitespaceTerminator(' hello ', 'end'));
            assert.equal(6, WhitespaceHandlers.computeWhitespaceTerminator('  hello  ', 'end'));

        });

    });

    describe('createWhitespacePredicate', function() {

        it("basic", function() {

            function toPredicateArray(text: string) {
                const whitespacePredicate = WhitespaceHandlers.createWhitespacePredicate(text);
                return Array.from(text)
                            .map((value, idx) => idx)
                            .map(whitespacePredicate);

            }

            assertJSON(toPredicateArray(' '), [true]);
            assertJSON(toPredicateArray(' \t\r'), [true, true, true]);

            assertJSON(toPredicateArray(' hello '), [true, false, false, false, false, false, true]);
            assertJSON(toPredicateArray(''), []);
            assertJSON(toPredicateArray('hello'), [false, false, false, false, false]);


        });

    });

});
