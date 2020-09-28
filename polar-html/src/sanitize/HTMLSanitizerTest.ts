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

    describe('sanitizePortableDocument', function () {
        const content = `<img data-attachment-id="14" data-permalink="https://masterhowtolearn.wordpress.com/2018/10/28/why-i-switched-to-supermemo-after-using-anki-for-5-years-with-over-50000-cards-and-420000-total-reviews/thank-you-letter/" data-orig-file="https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png" data-orig-size="1024,889" data-comments-opened="1" data-image-meta="{&quot;aperture&quot;:&quot;0&quot;,&quot;credit&quot;:&quot;&quot;,&quot;camera&quot;:&quot;&quot;,&quot;caption&quot;:&quot;&quot;,&quot;created_timestamp&quot;:&quot;0&quot;,&quot;copyright&quot;:&quot;&quot;,&quot;focal_length&quot;:&quot;0&quot;,&quot;iso&quot;:&quot;0&quot;,&quot;shutter_speed&quot;:&quot;0&quot;,&quot;title&quot;:&quot;&quot;,&quot;orientation&quot;:&quot;0&quot;}" data-image-title="thank-you-letter" data-image-description="" data-medium-file="https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png?w=300" data-large-file="https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png?w=1024" class="alignnone size-full wp-image-14" src="https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png?w=1100" alt="thank-you-letter" srcset="https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png 1024w, https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png?w=150 150w, https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png?w=300 300w, https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png?w=768 768w" sizes="(max-width: 1024px) 100vw, 1024px">`;
        // const content = `<img src="https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png?w=1100">`;

        it('img', function () {
            assert.equal(HTMLSanitizer.sanitizePortableDocument(content), '<img src="https://masterhowtolearn.files.wordpress.com/2018/10/thank-you-letter.png?w=1100" alt="thank-you-letter" />');
        });

    });

});

