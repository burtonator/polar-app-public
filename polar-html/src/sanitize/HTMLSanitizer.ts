import sanitizeHtml from 'sanitize-html';

export namespace HTMLSanitizer {

    export function sanitize(html: string) {

        return sanitizeHtml(html, {

            // TODO: add all of these below.. to allowedAttributes.
            allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
                           'cite', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i',
                           'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                           'table', 'thead', 'caption', 'tbody', 'tr', 'th',
                           'td', 'pre', 'iframe' ],

            allowedAttributes: {

                'pre': ["style"],
                'ul': ["style"],
                'ol': ["style"],
                'li': ["style"],
                'ni': ["style"],
                'code': ["style"],
                'p': ["style"],
                'div': ["style"],
                'span': ["style"],
                'b': ["style"],

                'blockquote': ["style", "cite"],
                "a": [ 'style', 'href', 'name', 'target', 'rel', 'type' ],
                "img": [ 'style', 'src', 'title', 'alt', 'width', 'height' ]

            },
            allowedStyles: {
                '*': {

                    // TODO: top,bottom,left,right versions of many of these

                    'color': [/.*/],
                    'background-color': [/.*/],
                    'text-align': [/.*/],
                    'font': [/.*/],
                    'font-family': [/.*/],
                    'font-variant': [/.*/],
                    'font-size': [/.*/],
                    'font-weight': [/.*/],
                    'text-decoration': [/.*/],
                    'text-transform': [/.*/],
                    'text-indent': [/.*/],
                    'line-height': [/.*/],
                    'letter-spacing': [/.*/],
                    'direction': [/.*/],
                    'word-spacing': [/.*/],
                    'text-shadow': [/.*/],
                    'white-space': [/.*/],
                    'width': [/.*/],
                    'height': [/.*/],
                    'sans-serif': [/.*/],
                    'transform': [/.*/],

                    'margin': [/.*/],
                    'padding': [/.*/],
                    'border': [/.*/],

                },

            }

        });

    }

    export function sanitizePasteData(html: string) {

        return sanitizeHtml(html, {

            // TODO: add all of these below.. to allowedAttributes.
            allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
                           'cite', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i',
                           'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                           'table', 'thead', 'caption', 'tbody', 'tr', 'th',
                           'td', 'pre' ],

            allowedAttributes: {

                'pre': ["style"],
                'ul': ["style"],
                'ol': ["style"],
                'li': ["style"],
                'ni': ["style"],
                'code': ["style"],
                'p': ["style"],
                'div': ["style"],
                'span': ["style"],
                'b': ["style"],

                'blockquote': ["style", "cite"],
                "a": [ 'style', 'href', 'name', 'target', 'rel', 'type' ],
                "img": [ 'style', 'src', 'title', 'alt', 'width', 'height' ]

            },
            allowedStyles: {
                '*': {

                    // TODO: top,bottom,left,right versions of many of these

                    'font-weight': [/.*/],
                    'text-decoration': [/.*/],
                    'text-transform': [/.*/],
                    'text-indent': [/.*/],
                    'line-height': [/.*/],
                    'letter-spacing': [/.*/],
                    'direction': [/.*/],
                    'word-spacing': [/.*/],
                    'white-space': [/.*/],
                    'transform': [/.*/],

                },

            }

        });

    }


    /**
     * Sanitize a document so that it's in a 'portable' format of HTML that can
     * reflow and we can use in our EPUB system.
     */
    export function sanitizePortableDocument(html: string) {

        return sanitizeHtml(html, {

            // TODO: add all of these below.. to allowedAttributes.
            allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
                           'cite', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i',
                           'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                           'table', 'thead', 'caption', 'tbody', 'tr', 'th',
                           'td', 'pre', 'img'],

            allowedAttributes: {

                'pre': ["style"],
                'ul': ["style"],
                'ol': ["style"],
                'li': ["style"],
                'ni': ["style"],
                'code': ["style"],
                'p': ["style"],
                'div': ["style"],
                'span': ["style"],
                'b': ["style"],

                'blockquote': ["style", "cite"],
                "a": [ 'style', 'href', 'name', 'target', 'rel', 'type' ],
                "img": [ 'style', 'src', 'title', 'alt', 'width', 'height' ]

            },
            allowedStyles: {
                '*': {

                    // TODO: top,bottom,left,right versions of many of these

                    'color': [/.*/],
                    'background-color': [/.*/],
                    'text-align': [/.*/],
                    'text-decoration': [/.*/],
                    'text-indent': [/.*/],
                    'line-height': [/.*/],
                    'letter-spacing': [/.*/],
                    'direction': [/.*/],
                    'word-spacing': [/.*/],
                    'white-space': [/.*/],
                    'width': [/.*/],
                    'height': [/.*/],

                    'margin': [/.*/],
                    'padding': [/.*/],
                    'border': [/.*/],

                },

            }

        });

    }

    /**
     * Sanitize but convert everything just to plain text.
     */
    export function toText(html: string) {

        return sanitizeHtml(html, {

            allowedTags: [],
            allowedAttributes: {
            },
            allowedStyles: {
            }

        });

    }

}
