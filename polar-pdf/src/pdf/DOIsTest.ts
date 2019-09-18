import {assert} from 'chai';
import {DOIs} from './DOIs';

describe('DOIs', function() {

    it("basic", async function() {

        assert.equal(DOIs.parseDOI("doi:10.1016/j.neuron.2018.01.009"), "10.1016/j.neuron.2018.01.009");

    });

});
