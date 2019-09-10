import {assert} from "chai";
import {GroupURLs} from "./GroupURLs";
import {assertJSON} from "../../../../web/js/test/Assertions";

describe('GroupURLs', function() {

    it("basic", function() {

        assertJSON(GroupURLs.parse('http://getpolarized.io/group/bar'), {name: 'bar'});

    });

});
