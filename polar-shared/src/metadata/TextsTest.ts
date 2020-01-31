import {assert} from 'chai';
import {Texts} from "./Texts";

describe('Texts', function() {

    it("basic", function() {

        assert.equal(Texts.toString({HTML: 'hello'}), 'hello');
        assert.equal(Texts.isText({HTML: ''}), true);
        assert.equal(Texts.toString({HTML: ''}), '');

    });

});
