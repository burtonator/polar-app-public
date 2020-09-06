import {QueryRegexps} from "./QueryRegExps";
import {assert} from "chai";
import {DOMTextIndexes} from "./DOMTextIndexes";
import {TextLookupIndexes} from "./TextLookupIndexes";
const jsdomGlobal = require('jsdom-global');

describe('TextLookupIndexes', function() {

    describe('mergeToRegionsByNode', function() {

        it("correct start/end across nodes", function() {
            const html = `<html><body><p>this <b>is</b> a test</p><body></body></html>`;
            jsdomGlobal(html);

            const index = DOMTextIndexes.create();

            const merged = TextLookupIndexes.mergeToRegionsByNode(index.textLookupIndex.lookup);

            console.log("merged: ", JSON.stringify(merged, null, '  '));

        });

    });

});
