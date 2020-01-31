import {assert} from "chai";
import {FrontMatterParser} from "./FrontMatterParser";

describe('FrontMatterParser', function() {

    it("basic", function() {

        const data = "---\ntitle: hello\n---\nthis is the body"

        const stripped = FrontMatterParser.strip(data);
        assert.equal("this is the body", stripped);

    });

});

