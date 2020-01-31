import {assert} from 'chai';
import {Base64} from './Base64';

describe('Base64', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("basic", async function() {

        assert.equal("YXNkZg==", Base64.encode("asdf"));

    });

});
