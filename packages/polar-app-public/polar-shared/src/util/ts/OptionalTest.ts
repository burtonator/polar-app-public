import {assert} from 'chai';
import {Optional} from './Optional';

describe('Optional', function() {

    it("Test nullable object", function() {

        // test to make sure we can pass in a nullable option defined as part
        // of the type and that we can map it without any type issues.

        interface State {
            zip: string;
        }

        const state: State | null = {
            zip: "94107"
        };

        const zip = Optional.of(state)
            .map(current => current.zip)
            .map(current => parseInt(current, 10))
            .get();

        assert.equal(zip, 94107);

    });

    it("Change type within map function", function() {

        const value = Optional.of('100')
            .map(current => parseInt(current, 10))
            .filter(current => current === 100)
            .get();

        assert.equal(value, 100);

    });


    it("first", function() {

        assert.equal(Optional.first(undefined, 'second').get(), 'second');
        assert.equal(Optional.first('first', undefined).get(), 'first');

        assert.equal(Optional.first(null, 'second').get(), 'second');
        assert.equal(Optional.first('first', null).get(), 'first');

    });


    it("first using functions", function() {

        assert.equal(Optional.first<string>(() => "cat").get(), "cat");

        assert.equal(Optional.first<string>(() => "cat",
                                            () => "dog").get(), "cat");

    });

    it("first with second function never called", function() {

        const funcA = () => "hello";

        let called = false;

        const funcB = () => {
            called = true;
            return "world";
        };

        assert.equal(Optional.first<string>(funcA, funcB).get(), "hello");
        assert.equal(called, false);

    });


    describe('validateString', function() {

        it("valid data", function() {
            assert.equal(Optional.of('hello').validateString().get(), 'hello');
        });

        it("invalid data", function() {
            assert.equal(Optional.of(666).validateString().getOrUndefined(), undefined);
        });

    });

    describe('validateNumber', function() {

        it("valid data", function() {
            assert.equal(Optional.of(101).validateNumber().get(), 101);
        });

        it("invalid data", function() {
            assert.equal(Optional.of('asdf').validateNumber().getOrUndefined(), undefined);
        });

    });


    describe('validateBoolean', function() {

        it("valid data", function() {
            assert.equal(Optional.of(false).validateBoolean().get(), false);
        });

        it("invalid data", function() {
            assert.equal(Optional.of('hello').validateBoolean().getOrUndefined(), undefined);
        });

    });


    describe('mapping non-nullable', function() {

        it("basic", function() {

            interface Address {
                state: string | undefined;
            }

            const test: Address = {
                state: 'CA'
            };

            const optional = Optional.of(test);

            const mapped = optional.map(current => current.state);

        });

    });


    describe('getOrNull', function() {

        it("basic", function() {
            assert.isNull(Optional.of(null).getOrNull());
            assert.isNull(Optional.of(undefined).getOrNull());
        });

    });

    describe('getOrUndefined', function() {

        it("basic", function() {
            assert.isUndefined(Optional.of(null).getOrUndefined());
            assert.isUndefined(Optional.of(undefined).getOrUndefined());
        });

    });



});
