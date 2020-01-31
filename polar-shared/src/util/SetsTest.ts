import {assert} from 'chai';
import {Sets} from './Sets';

describe("Sets", function () {
    it("basic", function () {

        const set0 = new Set(['foo']);
        const set1 = new Set(['bar']);

        const merged = Sets.mergedSets(set0, set1);

        assert.equal(JSON.stringify(Sets.toArray(merged)), '["foo","bar"]');

    });

});
