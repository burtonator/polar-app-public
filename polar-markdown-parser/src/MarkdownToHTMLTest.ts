import {MarkdownToHTML} from "./MarkdownToHTML";
import markdown2html = MarkdownToHTML.markdown2html;
import {assert} from 'chai';

describe('MarkdownToHTML', function() {

    it('basic', function() {

        assert.equal(markdown2html('**this is bold**'), '<p><b>this is bold</b></p>\n');

    });

});
