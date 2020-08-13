import {assert} from 'chai';
import {Whitespace} from "./Whitespace";
import { assertJSON } from 'polar-test/src/test/Assertions';

describe('Whitespace', function() {

    describe('computeWhitespaceTerminator', function() {

        it("basic", function() {

            assert.isUndefined(Whitespace.computeWhitespaceTerminator('', 'start'));
            assert.isUndefined(Whitespace.computeWhitespaceTerminator('', 'end'));

            assert.equal(0, Whitespace.computeWhitespaceTerminator('hello', 'start'));
            assert.equal(1, Whitespace.computeWhitespaceTerminator(' hello ', 'start'));
            assert.equal(2, Whitespace.computeWhitespaceTerminator('  hello  ', 'start'));

            assert.equal(4, Whitespace.computeWhitespaceTerminator('hello', 'end'));
            assert.equal(5, Whitespace.computeWhitespaceTerminator(' hello ', 'end'));
            assert.equal(6, Whitespace.computeWhitespaceTerminator('  hello  ', 'end'));

        });

    });

    describe('createWhitespacePredicate', function() {

        it("basic", function() {

            function toPredicateArray(text: string) {
                const whitespacePredicate = Whitespace.createWhitespacePredicate(text);
                return Array.from(text)
                            .map((value, idx) => idx)
                            .map(whitespacePredicate);

            }

            assertJSON(toPredicateArray('x\nx'), [false, false, false]);

            assertJSON(toPredicateArray(' '), [true]);
            assertJSON(toPredicateArray(' \t\r'), [true, true, true]);

            assertJSON(toPredicateArray(' hello '), [true, false, false, false, false, false, true]);
            assertJSON(toPredicateArray(''), []);
            assertJSON(toPredicateArray('hello'), [false, false, false, false, false]);


        });

    });

    describe('collapse', function() {

        it("basic", function() {
            assert.equal(Whitespace.collapse(' '), '');
            assert.equal(Whitespace.collapse('   hello   world '), 'hello world');

            assert.equal(Whitespace.canonicalize(Whitespace.collapse('Anon, to sudden silence won,\n' +
                                                 'In fancy they pursue')),
                         "Anon, to sudden silence won, In fancy they pursue");

        });

    });


});
