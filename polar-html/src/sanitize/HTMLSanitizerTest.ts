import {assert} from 'chai';
import {HTMLSanitizer} from './HTMLSanitizer';

describe('HTMLSanitizer', function () {

    it('basic', function () {
        assert.equal(HTMLSanitizer.sanitize('<p class="foo">'), '<p></p>');
    });


    it('xhtml', function () {
        assert.equal(HTMLSanitizer.sanitize('<br>'), '<br />');
    });

    it('with minimal CSS', function () {

        // TODO: we probably want this to work
        assert.equal(HTMLSanitizer.sanitize('<p style="font-weight: bold">'), '<p style="font-weight:bold"></p>');

    });

    it('div', function () {

        // TODO: we probably want this to work
        assert.equal(HTMLSanitizer.sanitize('<div style="font-weight: bold">'), '<div style="font-weight:bold"></div>');

    });

    it('toText', function () {

        assert.equal(HTMLSanitizer.toText('<p>this is <b>some</b> text</p>'), 'this is some text');

    });

});
