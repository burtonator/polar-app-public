import TurndownService from 'turndown';
const { gfm } = require('turndown-plugin-gfm');

export namespace HTMLToMarkdown {

    // eslint-disable-next-line max-len
    const regex = /\b(?:https?:\/\/|www\.)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’])/g;

    // Override the original escape method by not escaping links.
    const originalEscape = TurndownService.prototype.escape;

    function escape( text: string ) {

        text = originalEscape( text );

        // Escape "<".
        text = text.replace( /</g, '\\<' );

        return text;
    }

    class MyTurndownService extends TurndownService {

        escape(text: string): string {

            // Urls should not be escaped. Our strategy is using a regex to find them and escape everything
            // which is out of the matches parts.

            let escaped = '';
            let lastLinkEnd = 0;

            for ( const match of (text.matchAll(regex) || []) ) {
                const index = match.index;

                if (index === undefined) {
                    continue;
                }

                // Append the substring between the last match and the current one (if anything).
                if ( index > lastLinkEnd ) {
                    escaped += escape( text.substring( lastLinkEnd, index ) );
                }

                const matchedURL = match[ 0 ];

                escaped += matchedURL;

                lastLinkEnd = index + matchedURL.length;
            }

            // Add text after the last link or at the string start if no matches.
            if ( lastLinkEnd < text.length ) {
                escaped += escape( text.substring( lastLinkEnd, text.length ) );
            }

            return escaped;

        }
    }

    const turndownService = new MyTurndownService({
        codeBlockStyle: 'fenced',
        hr: '---',
        headingStyle: 'atx',
        emDelimiter: "*"
    });

    turndownService.addRule('strikethrough', {
        filter: ['del', 's', 'strike' as any],
        // tslint:disable-next-line:object-literal-shorthand
        replacement: function (content) {
            return '~' + content + '~'
        }
    });

    turndownService.addRule('subscript', {
        filter: ['sub'],
        // tslint:disable-next-line:object-literal-shorthand
        replacement: function (content) {
            return '<sub>' + content + '</sub>'
        }
    });

    turndownService.addRule('superscript', {
        filter: ['sup'],
        // tslint:disable-next-line:object-literal-shorthand
        replacement: function (content) {
            return '<sup>' + content + '</sup>'
        }
    });

    turndownService.use( [
        gfm,
        // todoList
    ] );

    /**
     * Parses HTML to a markdown.
     */
    export function html2markdown( html: string ) {
        return turndownService.turndown(html);
    }

}

// // This is a copy of the original taskListItems rule from turdown-plugin-gfm, with minor changes.
// function todoList( turndownService: TurndownService ) {
//     turndownService.addRule( 'taskListItems', {
//         filter( node ) {
//             return node.type === 'checkbox' &&
//                 // Changes here as CKEditor outputs a deeper structure.
//                 ( node.parentNode.nodeName === 'LI' || node.parentNode.parentNode.nodeName === 'LI' );
//         },
//         replacement( content, node ) {
//             return ( node.checked ? '[x]' : '[ ]' ) + ' ';
//         }
//     } );
// }
