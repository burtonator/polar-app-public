import {assert} from 'chai';
import {Strings} from './Strings';

describe('Strings', function() {

    describe('integers', function() {

        it("basic", function () {
            assert.equal(Strings.toPrimitive("0"), 0);
            assert.equal(typeof Strings.toPrimitive("0"), "number");
        });

    });

    describe('booleans', function() {

        it("basic", function () {
            assert.equal(Strings.toPrimitive("true"), true);
            assert.equal(typeof Strings.toPrimitive("true"), "boolean");

            assert.equal(Strings.toPrimitive("false"), false);
            assert.equal(typeof Strings.toPrimitive("false"), "boolean");

        });

    });


    describe('toUnixLineNewLines', function() {

        it("basic", function() {

            assert.equal(Strings.toUnixLineNewLines('this\r\nis\r\nlong\r\n'), 'this\nis\nlong\n')
        });

    });

    describe('indent', function() {

        it("basic", function() {

            assert.equal(Strings.indent("hello", "  "), "  hello");

        });

        it("two lines", function() {

            assert.equal(Strings.indent("hello\nworld", "  "), "  hello\n  world");

        });

        it("three lines", function() {

            assert.equal(Strings.indent("hello\nworld\ncat", "  "), "  hello\n  world\n  cat");

        });

    });

});
