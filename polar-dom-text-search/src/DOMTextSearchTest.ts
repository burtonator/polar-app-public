import {assert} from 'chai';
import {DOMTextSearch} from "./DOMTextSearch";
import {JSDOM} from "jsdom";
import {assertJSON} from "polar-test/src/test/Assertions";

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
        assert.equal(result!.regions.length, 1);
        assert.equal(result!.regions[0].node.textContent, 'this is a basic test');

    });

    xit("basic with iframe", function() {

        console.log(JSDOM)

        const html = `<html><body><p>this is a basic test</p><iframe srcdoc=""></iframe></body></html>`;
        jsdomGlobal(html);

        document.querySelector('iframe')!.contentDocument!.documentElement.innerHTML = '<html><body> <p>and this is the iframe</p></body></html>';

        // console.log(document);

        const index = DOMTextSearch.createIndex();

        assert.equal(index.toString(), 'this is a basic test and this is the iframe');

        const result = index.find('this is a basic test');

        assert.ok(result);
        assert.equal(result!.regions.length, 1);
        assert.equal(result!.regions[0].node.textContent, 'this is a basic test');

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
        assert.equal(result!.regions.length, 5);

    });


    it("toString with whitespace between nodes", function() {

        const html = `
<html>
<body>
<p>
<b>this</b> and <i>that</i>
</p>

Graph-based neural network

</body>
</html>`;

        jsdomGlobal(html);

        const index = DOMTextSearch.createIndex();

        assert.equal(index.toString(), 'this and that Graph-based neural network');

        assertJSON(index.find('Graph'), {});

    });


    it("basic incorrect offset", function() {

        const html = `
<html>
<body>
<p>this</p>

Graph-based neural network

</body>
</html>`;

        jsdomGlobal(html);

        const index = DOMTextSearch.createIndex();

        assert.equal(index.toString(), 'this Graph-based neural network');

        assertJSON(index.find('Graph'), {});

    });

});
