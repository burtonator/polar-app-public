import {assert} from 'chai';
import {HTMLToMarkdown} from "./HTMLToMarkdown";
import html2markdown = HTMLToMarkdown.html2markdown;

describe('HTMLToMarkdown', function() {

    it('basic', function() {

        assert.equal(html2markdown('<p><strong>this is bold</strong></p>'), '**this is bold**');
        assert.equal(html2markdown('<p><i>this is italic</i></p>'), '*this is italic*');
        assert.equal(html2markdown('<p><del>strikethrough</del></p>'), "~strikethrough~");
        assert.equal(html2markdown('<p><a href="http://www.example.com">link to example</a></p>'), '[link to example](http://www.example.com)');
        assert.equal(html2markdown('<p><sup>superscript</sup></p>'), '<sup>superscript</sup>');
        assert.equal(html2markdown('<p><sub>subscript</sub></p>'), '<sub>subscript</sub>');

    });

    it('<br/>', function() {
        assert.equal(html2markdown('<br/>'), '');
    });

});
