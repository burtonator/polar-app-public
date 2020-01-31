import {assert} from 'chai';
import {HighlightColors} from './HighlightColor';

describe('HighlightColor', function() {

    it("basic", function() {

        const rgba = HighlightColors.toRGBA('#FFFF00', 0.7);

        assert.equal(rgba, 'rgba(255, 255, 0, 0.7)');

    });

});
