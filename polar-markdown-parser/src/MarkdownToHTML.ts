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

class MyRenderer extends marked.Renderer {

    strong(text: string): string {
        return '<b>' + text + '</b>';
    }

    em(text: string): string {
        return '<i>' + text + '</i>';
    }

}

export namespace MarkdownToHTML {

    export function markdown2html(markdown: string) {

        return marked.parse( markdown, {
            gfm: true,
            breaks: true,
            // tables: true,
            xhtml: true,
            headerIds: false,
            smartypants: false,
            renderer: new MyRenderer()
        }).replace(/&#39;/g, "'")
          .trim();

    }

}
