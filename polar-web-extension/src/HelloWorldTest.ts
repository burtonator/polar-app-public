import {assert} from 'chai';
import Readability from "@polar-app/readability";

describe('Hello World', function() {

    it("basic", function() {

        const parser = new DOMParser();
        const doc = parser.parseFromString('<html></html>', 'text/html');

        const parsed = new Readability(doc);
        assert.ok(true);
    });

});
