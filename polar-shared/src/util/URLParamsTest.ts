import {URLParams} from "./URLParams";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('URLParams', function() {

    it("parse", function() {

        assertJSON(URLParams.parse('http://www.example.com/foo/bar'), {});
        assertJSON(URLParams.parse('http://www.example.com/foo/bar?cat=dog'), {'cat': 'dog'});
        assertJSON(URLParams.parse('http://www.example.com/foo/bar?cat=dog&bird=mouse'), {'cat': 'dog', 'bird': 'mouse'});

    });

});
