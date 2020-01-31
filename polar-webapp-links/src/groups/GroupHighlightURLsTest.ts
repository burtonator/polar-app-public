import {GroupHighlightURLs} from "./GroupHighlightURLs";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('GroupHighlightURLs', function() {

    it("basic", function() {

        assertJSON(GroupHighlightURLs.parse('http://getpolarized.io/group/linux/highlight/10101'), {
            "id": "10101",
            "name": "linux"
        });

    });

});
