import {assertJSON} from "../../../../polar-bookshelf/web/js/test/Assertions";
import {GroupHighlightURLs} from "./GroupHighlightURLs";

describe('GroupHighlightURLs', function() {

    it("basic", function() {

        assertJSON(GroupHighlightURLs.parse('http://getpolarized.io/group/linux/highlight/10101'), {
            "id": "10101",
            "name": "linux"
        });

    });

});
