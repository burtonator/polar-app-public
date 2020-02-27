/**
 * Provides a framework to search text within a DOM and jump to to the elements
 * that contain that text.
 */


import {createSiblings} from "../../polar-shared/src/util/Functions";

/**
 * Return true if the given character is whitespace.
 */
function isWhitespace(c: string) {

    switch (c) {

        case ' ':
        case '\f':
        case '\r':
        case '\n':
        case '\v':
        case '\t':
        case '\u00A0':
        case '\u2029':
            return true;
        default:
            return false;
    }

}

export interface Pointer {

    /**
     * The value of this character in text.
     */
    readonly value: string;

    /**
     * The offset into this node that the character is stored.
     */
    readonly offset: number;

    /**
     * The node for this item.
     */
    readonly node: Node;

}

export type PointerIndex = ReadonlyArray<Pointer>;

class TextIndex {

    /**
     *
     * @param pointers allows us to lookup the node and offset of the text any text we index.
     */
    constructor(readonly pointers: PointerIndex) {
        this.pointers = pointers;
    }

    public lookup(start: number, end: number) {

        const result = [];

        for (let idx = start; idx <= end; ++idx) {
            const pointer = this.pointers[idx];
            result.push(pointer);
        }

        return result;

    }

    /**
     * Join hits to get contiguous text on nodes that need highlights.
     */
    // public join(hits: ReadonlyArray<Node>) {
    //
    //     for (const entry of createSiblings(hits)) {
    //
    //         const prevNode = hits.prev?.node;
    //         const currNode = hits.curr.node;
    //
    //         if (prevNode !== currNode) {
    //             result[result.length] = [];
    //         }
    //
    //         result[result.length - 1].push(entry.curr);
    //
    //     }
    //
    //     return result;
    //
    // }

    public find(text: string) {

        const str = this.toString();
        const idx = str.indexOf(text);

        if (idx !== -1) {

            const hits = this.lookup(idx, idx + text.length);

            for (const hit of hits) {
                // FIXME: noop right now..
            }

        }

        // no match
        return undefined;

    }

    public toString(): string {
        return this.pointers.map(current => current.value).join("");
    }

}

export class DOMTextSearch {

    public static createIndex() {

        const blacklist = ['script', 'iframe', 'link', 'style', 'head', 'object', 'video', 'img'];

        const treeWalker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);

        const pointers: Pointer[] = [];

        let node;
        while (true) {

            node = treeWalker.nextNode();

            if (! node) {
                break;
            }

            if (! node.parentElement) {
                continue;
            }

            const parentTagName = node.parentElement.tagName.toLowerCase();

            if (blacklist.includes(parentTagName)) {
                continue;
            }

            const nodeValue = node.nodeValue;

            if (nodeValue && nodeValue !== '') {

                const text = nodeValue;

                console.log("'" + text + "'");

                for (let idx = 0; idx < text.length; ++idx) {
                    const c = text[idx];

                    if (isWhitespace(c)) {
                        continue;
                    }

                    const pointer: Pointer = {
                        offset: idx,
                        node,
                        value: c
                    };

                    pointers.push(pointer);
                }

            }

        }

        return new TextIndex(pointers);

    }

}
