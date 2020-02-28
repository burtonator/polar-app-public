import {assert} from 'chai';
import {DOMTextSearch} from "./DOMTextSearch";

const jsdomGlobal = require('jsdom-global');

describe('DOMTextSearch', function() {

    it("basic", function() {

        const html = `<html><body><p>this is a basic test</p></body></html>`;
        jsdomGlobal(html);

        // console.log(document);

        const index = DOMTextSearch.createIndex();

        // console.log({index});

        assert.equal(index.toString(), 'this is a basic test');

        const result = index.find('this is a basic test');

        // console.log({result});

        assert.ok(result);
        assert.equal(result!.length, 1);
        assert.equal(result![0].node.textContent, 'this is a basic test');

    });

});
