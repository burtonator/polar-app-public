import {assert} from 'chai';
import {DOMTextSearch} from "./DOMTextSearch";
import {JSDOM} from "jsdom";

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

    it("basic with iframe", function() {

        console.log(JSDOM)

        const html = `<html><body><p>this is a basic test</p><iframe srcdoc=""></iframe></body></html>`;
        jsdomGlobal(html);

        document.querySelector('iframe')!.contentDocument!.documentElement.innerHTML = '<html><body> <p>and this is the iframe</p></body</html>';

        // console.log(document);

        const index = DOMTextSearch.createIndex();

        assert.equal(index.toString(), 'this is a basic test and this is the iframe');

        const result = index.find('this is a basic test');

        assert.ok(result);
        assert.equal(result!.length, 1);
        assert.equal(result![0].node.textContent, 'this is a basic test');

    });

    it("across node types", function() {

        const html = `<html><body><p><b>this</b> <i>is a</i> <a href="http://example.com">basic test</a></p></body></html>`;
        jsdomGlobal(html);

        // console.log(document);

        const index = DOMTextSearch.createIndex();

        // console.log({index});

        assert.equal(index.toString(), 'this is a basic test');

        const result = index.find('this is a basic test');

        console.log({result});

        assert.ok(result);
        assert.equal(result!.length, 5);

    });

});
