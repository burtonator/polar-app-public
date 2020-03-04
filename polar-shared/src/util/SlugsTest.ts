import {assert} from 'chai';
import {Slugs} from "./Slugs";


describe('Slugs', function() {

    it("Basic", async function() {

        assert.equal(Slugs.calculate('cat and dog'), 'cat-dog');
        assert.equal(Slugs.calculate('hello world'), 'hello-world');
        assert.equal(Slugs.calculate('this-already has a hyphen'), 'this-already-hyphen');

    });

});
