import {MarkdownToHTML} from "./MarkdownToHTML";
import markdown2html = MarkdownToHTML.markdown2html;
import {assert} from 'chai';

describe('MarkdownToHTML', function() {

    it('basic test of formatting', function() {

        assert.equal(markdown2html('**this is bold**'), '<p><b>this is bold</b></p>');
        assert.equal(markdown2html('*this is italic*'), '<p><i>this is italic</i></p>');
        assert.equal(markdown2html('~~hello~~'), '<p><del>hello</del></p>');
        assert.equal(markdown2html('<sub>hello</sub>'), '<p><sub>hello</sub></p>');
        assert.equal(markdown2html('<sup>hello</sup>'), '<p><sup>hello</sup></p>');

    });

    it('single quote', () => {
        assert.equal(markdown2html("hello 'world'"), '<p>hello \'world\'</p>');
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
