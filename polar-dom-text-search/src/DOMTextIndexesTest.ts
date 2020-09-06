import {assert} from 'chai';
import {JSDOM} from "jsdom";
import {assertJSON} from "polar-test/src/test/Assertions";
import {DOMTextHits} from "./DOMTextHits";
import {Strings} from "polar-shared/src/util/Strings";
import {DOMTextIndexes} from "./DOMTextIndexes";
const jsdomGlobal = require('jsdom-global');

describe('DOMTextIndexes', function() {

    /**
     * This will just test all possible DOM representations with whitespace
     * handling
     */
    describe('create', function() {

        function doTest(html: string, expectedText: string) {
            jsdomGlobal(html);
            const index = DOMTextIndexes.create();
            assert.equal(index.toString(), expectedText);
            assert.equal(index.textLookupIndex.text.length, index.textLookupIndex.lookup.length);
        }

        it("simple with no nodes", function() {
            doTest(`<html><body><p>this is a basic test</p></body></html>`,
                   'this is a basic test');
        });

        it("with inner spans for each word", function() {
            doTest(`<html><body><p><span>this</span> <span>is</span> <span>a</span> <span>basic</span> <span>test</span></p></body></html>`,
                   'this is a basic test');
        });

        it("with a newline and spacing after", function() {
            doTest(`<html><body><p>this is a \n    basic test</p></body></html>`,
                   'this is a      basic test');
        });

        it("with simple redundant whitespace", function() {
            doTest(`<html><body><p>with     redundant     whitespace</p></body></html>`,
                   'with     redundant     whitespace');
        });


        // FIXME code up the remaining tests so that each one of our whitespace
        // scenarios is taken into consideration.

    })



    it("basic", function() {

        const html = `<html><body><p>this is a basic test</p></body></html>`;
        jsdomGlobal(html);

        // console.log(document);

        const index = DOMTextIndexes.create();

        assert.equal(index.toString(), 'this is a basic test');

        const query = 'this is a basic test';
        const hits = index.search(query);

        assert.ok(hits);
        assert.equal(hits.length, 1);

        const hit = hits[0];

        assert.equal(hit.regions.length, 1);
        const region = hit.regions[0];
        assert.equal(region.node.textContent, 'this is a basic test');
        assert.equal(DOMTextHits.extract(hits), 'this is a basic test');
        assert.equal((region.end - region.start) + 1, query.length);

    });

    xit("basic with iframe", function() {

        console.log(JSDOM)

        const html = `<html><body><p>this is a basic test</p><iframe srcdoc=""></iframe></body></html>`;
        jsdomGlobal(html);

        document.querySelector('iframe')!.contentDocument!.documentElement.innerHTML = '<html><body> <p>and this is the iframe</p></body></html>';

        // console.log(document);

        const index = DOMTextIndexes.create();

        assert.equal(index.toString(), 'this is a basic test and this is the iframe');

        const result = index.search('this is a basic test');

        assert.ok(result);
        assert.equal(result![0].regions.length, 1);
        assert.equal(result![0].regions[0].node.textContent, 'this is a basic test');

    });

    it("across node types", function() {

        const html = `<html><body><p><b>this</b> <i>is a</i> <a href="http://example.com">basic test</a></p></body></html>`;
        jsdomGlobal(html);

        // console.log(document);

        const index = DOMTextIndexes.create();

        // console.log({index});

        assert.equal(index.toString(), 'this is a basic test');

        const hits = index.search('this is a basic test');

        assert.equal(DOMTextHits.extract(hits), 'this is a basic test');

        console.log({hits});

        assert.ok(hits);
        assert.ok(hits.length === 1);

        assertJSON(hits, [
            {
                "id": "hit-0-19",
                "regions": [
                    {
                        "nodeID": 0,
                        "start": 0,
                        "end": 3,
                        "node": {}
                    },
                    {
                        "nodeID": 1,
                        "start": 0,
                        "end": 0,
                        "node": {}
                    },
                    {
                        "nodeID": 2,
                        "start": 0,
                        "end": 3,
                        "node": {}
                    },
                    {
                        "nodeID": 3,
                        "start": 0,
                        "end": 0,
                        "node": {}
                    },
                    {
                        "nodeID": 4,
                        "start": 0,
                        "end": 9,
                        "node": {}
                    }
                ]
            }
        ])

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

        const index = DOMTextIndexes.create();

        assert.equal(index.toString(), '  this and that   Graph-based neural network   ');
        const hits = index.search('Graph');
        console.log("hits: ", JSON.stringify(hits));
        assert.equal(DOMTextHits.extract(hits), 'Graph');

        assertJSON(hits, [
            {
                "id": "hit-18-22",
                "regions": [
                    {
                        "nodeID": 6,
                        "start": 2,
                        "end": 6,
                        "node": {}
                    }
                ],
            }
        ]);

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

        const index = DOMTextIndexes.create();
        const hits = index.search('Graph');
        assert.equal(DOMTextHits.extract(hits), 'Graph');

        assertJSON(hits, [
            {
                "id": "hit-7-11",
                "regions": [
                    {
                        "nodeID": 2,
                        "start": 2,
                        "end": 6,
                        "node": {}
                    }
                ],
            }
        ]);

        assert.equal(index.toString(), ' this  Graph-based neural network   ');

    });

    it("whitespace handling", function() {

        const html = `
<html>
<body>
<p>
this\ris\na\ttest
</p>
</body>
</html>`;

        jsdomGlobal(html);

        const index = DOMTextIndexes.create();
        assert.equal(index.toString(), '  this is a test   ');

        const hits = index.search('this is a test');

        assert.equal(hits.length, 1);
        assert.equal(DOMTextHits.extract(hits), 'this\nis\na\ttest');

    });

    it("broken with nested elements", function() {

        /// FXME: isWhitespace should return true for &nbsp;

        const html = `<html><body><p>Interested in the technical details? &nbsp;We use 1000 rounds of PBKDF2 to derive your passphrase into the authentication token<a href="#foot-1">1</a>. On the server, we additionally hash this token with <a href="https://en.wikipedia.org/wiki/Scrypt" target="_blank">scrypt</a> (parameters N=65536, r=8, p=1)<a href="#foot-2">2</a> to make sure our database of authentication tokens is even more difficult to crack.</p><body></body></html>`;
        // const html = `<html><body><p>Interested in the technical details? We use 1000 rounds of PBKDF2 to derive your passphrase into the authentication token<a href="#foot-1">1</a>. On the server, we additionally hash this token with <a href="https://en.wikipedia.org/wiki/Scrypt" target="_blank">scrypt</a> (parameters N=65536, r=8, p=1)<a href="#foot-2">2</a> to make sure our database of authentication tokens is even more difficult to crack.</p><body></body></html>`;
        // const html = `<html><body><p>Interested in the technical details? We use 1000 rounds of PBKDF2 to derive your passphrase into the authentication token 1. On the server, we additionally hash this token with scrypt (parameters N=65536, r=8, p=1)2 to make sure our database of authentication tokens is even more difficult to crack.</p><body></body></html>`;

        jsdomGlobal(html);

        const index = DOMTextIndexes.create();
        // assert.equal(index.toString(), 'Interested in the technical details? We use 1000 rounds of PBKDF2 to derive your passphrase into the authentication token 1 . On the server, we additionally hash this token with scrypt (parameters N=65536, r=8, p=1) 2 to make sure our database of authentication tokens is even more difficult to crack.');
        const hits = index.search('this is a test');

        // assert.equal(hits.length, 1);
        // assert.equal(DOMTextHits.extract(hits), 'this\nis\na\ttest');

    });

    it("Make sure &nbsp; is whitespace so it doesn't break search", function() {
        const html = `<html><body><p>&nbsp;</p><body></body></html>`;
        jsdomGlobal(html);
        const textContent = document.body.textContent!;
        assert.equal(textContent, ' ');
        assert.isTrue(Strings.isWhitespace(textContent[0]));
    });

    it("Search inside a node and make sure the node offset is correct", function() {

        const html = `<html><body><p>this <b>is</b> a test</p><body></body></html>`;
        jsdomGlobal(html);

        const index = DOMTextIndexes.create();
        const hits = index.search('this is a test');
        assert.equal(DOMTextHits.extract(hits), 'this is a test');

    });


});
