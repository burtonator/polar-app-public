import {assert} from 'chai';
import {Readability} from "@polar-app/readability";

describe('Readability', function() {

    it("basic", function() {

        const parser = new DOMParser();
        const doc = parser.parseFromString('<html><body><p>this is some text</p></body></html>', 'text/html');

        // TODO also parse out the HTML microdata.
        const readability = new Readability(doc);
        const parsed = readability.parse();

        console.log(parsed.content);
        assert.equal(parsed.content, '<div id="readability-page-1" class="page"><p>this is some text</p></div>');

    });

});
