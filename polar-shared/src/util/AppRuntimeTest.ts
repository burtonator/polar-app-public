import {AppRuntime} from "./AppRuntime";
import {assert} from 'chai';

describe('AppRuntime', function() {

    it("basic", async function() {
        assert.equal(AppRuntime.get(), 'node');
    });

});

