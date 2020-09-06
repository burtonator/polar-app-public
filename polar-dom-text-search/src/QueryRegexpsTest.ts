import {QueryRegexps} from "./QueryRegExps";
import {assert} from 'chai';

describe('QueryRegexps', function() {

    function doTest(text: string,
                    expected: string,
                    caseInsensitive: boolean,
                    verification?: string) {

        verification = verification !== undefined ? verification : text;

        const regexp = QueryRegexps.toRegExp(text);
        assert.equal(regexp, expected);

        const m = verification.match(regexp);
        assert.isTrue(m !== null);
        assert.isTrue(m!.length === 1);
        assert.isTrue(m![0] === verification);

    }

    it("basic", function() {

        doTest('hello world', 'hello\\s+world', false);
        doTest('hello     world', 'hello\\s+world', false);
        doTest('hello     world', 'hello\\s+world', false, 'hello world');
        doTest('hello     world', 'hello\\s+world', false, 'hello    world');
        doTest('hello     world', 'hello\\s+world', false, 'hello  \r\n  world');
        doTest('hello  \r\n   world', 'hello\\s+world', false);
        doTest("hello \u00A0 world", 'hello\\s+world', false, "hello world");
        doTest("hello \u00A0 world", 'hello\\s+world', false, "hello \u00A0 world");

    });

});
