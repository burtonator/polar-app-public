import {assert} from 'chai';
import {toIdentifier} from "./Identifiers";

describe('Identifiers', function() {

    it("basic", function () {
        assert.equal(toIdentifier('hello world'), 'hello-world');
        assert.equal(toIdentifier('this, that, and the other'), 'this-that-and-the-other');
        assert.equal(toIdentifier('hello world, 2, 3,4 '), 'hello-world-2-3-4');
        assert.equal(toIdentifier(' hello world '), 'hello-world');
    });

});
