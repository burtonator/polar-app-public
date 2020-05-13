import {assert} from 'chai';
import {ValueProvider} from "./ValueProvider";

describe('ValueProvider', function() {

    it("basic", function() {

        const value = ValueProvider.create('hello');

        assert.equal(value.get(), 'hello');
        value.set('world');
        assert.equal(value.get(), 'world');

        const foo = value.get;

        assert.equal(foo(), 'world');

    });

});
