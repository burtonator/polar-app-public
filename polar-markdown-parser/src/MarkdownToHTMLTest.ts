import {MarkdownToHTML} from "./MarkdownToHTML";
import markdown2html = MarkdownToHTML.markdown2html;
import {assert} from 'chai';

describe('MarkdownToHTML', function() {

    it('basic', function() {

        assert.equal(markdown2html('**this is bold**'), '<p><b>this is bold</b></p>\n');

        assert.equal(markdown2html('*this is italic*'), '<p><i>this is italic</i></p>\n');

        assert.equal(markdown2html('_this is italic_'), '<p><i>this is italic</i></p>\n');

    });

    it('single quote', () => {
        assert.equal(markdown2html("hello 'world'"), '\n');
    });

    it('special chars', () => {

        const ignored = ["\"", "&", "'", "<", , ">"];

        for( let i = 33; i <= 126; i++){
            const ch = String.fromCharCode( i );

            if (ignored.includes(ch)) {
                continue;
            }

            assert.equal(markdown2html(ch), `<p>${ch}</p>`);

        }

        assert.equal(markdown2html("\""), `<p>&quot;</p>`);
        assert.equal(markdown2html("'"), `<p>'</p>`);

    });


});
