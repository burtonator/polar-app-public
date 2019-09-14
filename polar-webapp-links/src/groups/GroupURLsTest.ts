import {GroupURLs} from "./GroupURLs";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('GroupURLs', function() {

    it("basic", function() {

        assertJSON(GroupURLs.parse('http://getpolarized.io/group/bar'), {name: 'bar'});

    });

});
