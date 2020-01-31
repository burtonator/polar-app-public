import {assert} from 'chai';
import {Rewrites} from "./Rewrites";
import {PathToRegexps} from "polar-shared/src/url/PathToRegexps";
import { assertJSON } from 'polar-test/src/test/Assertions';

describe('RewritesTest', function() {

    it("basic", async function() {

        assert.equal(Rewrites.matchesRegex(PathToRegexps.pathToRegexp("/product/:product"), "/product/windows"), true);

    });

    it("toSources", async function() {


        assertJSON(Rewrites.toSources({
            source: '/foo',
            destination: "/"
        }), ['/foo']);

        assertJSON(Rewrites.toSources({
            source: ['/foo'],
            destination: "/"
        }), ['/foo']);

        assertJSON(Rewrites.toSources({
            source: ['/foo', '/bar'],
            destination: "/"
        }), ['/foo', '/bar']);

    });


});
