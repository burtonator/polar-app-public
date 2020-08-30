import {assert} from 'chai';
import {Strings} from './Strings';

describe('Strings', function() {

    describe('truncateOnWordBoundary', function() {

        it("basic", function () {
            assert.equal(Strings.truncateOnWordBoundary("this is a test", 5), "this ...");
            assert.equal(Strings.truncateOnWordBoundary("this is a test", 6), "this ...");
            assert.equal(Strings.truncateOnWordBoundary("this is a test", 7), "this ...");
            assert.equal(Strings.truncateOnWordBoundary("this is a test", 8), "this is ...");
            assert.equal(Strings.truncateOnWordBoundary("0123456789", 5), "01234");
        });

    });


    describe('integers', function() {

        it("basic", function () {
            assert.equal(Strings.toPrimitive("0"), 0);
            assert.equal(typeof Strings.toPrimitive("0"), "number");
        });

    });

    describe('canonicalizeWhitespace', function() {

        it("basic", function () {
            assert.equal(Strings.canonicalizeWhitespace("  hello \r\nworld"), " hello \nworld");
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

            assert.equal(Strings.toUnixLineNewLines('this\r\nis\r\nlong\r\n'), 'this\nis\nlong\n');
        });

    });


    describe('upperFirst', function() {

        it("basic", function() {
            assert.equal(Strings.upperFirst('hello'), 'Hello');
            assert.equal(Strings.upperFirst('h'), 'H');
            assert.equal(Strings.upperFirst(''), '');
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

    describe('isWhitespace', function() {

        it("basic", function() {
            assert.ok(Strings.isWhitespace(' '));
            assert.isFalse(Strings.isWhitespace('📸'));
        });

    });
});
