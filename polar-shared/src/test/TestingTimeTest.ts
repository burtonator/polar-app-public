import {assert} from 'chai';
import {TestingTime} from "./TestingTime";

describe('TestingTime', function() {

    it("basic", async function() {

        // *** test freezing to our epoch

        TestingTime.freeze();
        assert.equal(new Date().toISOString(), "2012-03-02T11:38:49.321Z");

        // *** jump forward an hour

        TestingTime.forward(3600000);
        assert.equal(new Date().toISOString(), "2012-03-02T12:38:49.321Z");

        // *** now we should reset back to epoch
        TestingTime.freeze();
        assert.equal(new Date().toISOString(), "2012-03-02T11:38:49.321Z");
    });

});

