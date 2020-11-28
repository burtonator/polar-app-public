import marked from 'marked';

// class MyTokenizer extends marked.Tokenizer {
//
//     public autolink() {
//         return null!;
//     }
//
//     public url() {
//         return null!;
//     }
//
// }

// Overrides.
marked.use({
    // tokenizer: new MyTokenizer()
});

export namespace MarkdownToHTML {

    export function markdown2html(markdown: any) {
        return marked.parse( markdown, {
            gfm: true,
            breaks: true,
            // tables: true,
            xhtml: true,
            headerIds: false
        });
    }

}