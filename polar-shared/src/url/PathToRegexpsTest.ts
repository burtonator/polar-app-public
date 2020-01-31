import {assert} from 'chai';
import {PathToRegexps, URLPathStr, URLRegularExpressionStr} from "./PathToRegexps";

function matchesRegex(regex: URLRegularExpressionStr, path: URLPathStr): boolean {

    const re = new RegExp(regex);
    const matches = re.exec(path);

    if (matches && matches[0] === path) {
        return true;
    }

    return false;

}

describe('PathToRegexps', function() {

    it("basic", async function() {

        assert.equal(PathToRegexps.pathToRegexp("/:foo"), "/([^/]+)");
        assert.equal(PathToRegexps.pathToRegexp("/products/:product/page/:page"), "/products/([^/]+)/page/([^/]+)");

        const regexp = PathToRegexps.pathToRegexp("/webapp/icon.png");

        assert.ok(matchesRegex(regexp, '/webapp/icon.png'));

    });

});

