import {createSiblings} from "polar-shared/src/util/Functions";
import {CharPtrs} from "./CharPtrs";

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


export interface MutableNodeTextRegion {
    start: number;
    end: number;
    node: Node;
}

export interface NodeTextRegion extends Readonly<MutableNodeTextRegion> {
}

export type PointerIndex = ReadonlyArray<Pointer>;

export class TextIndex {

    /**
     *
     * @param pointers allows us to lookup the node and offset of the text any text we index.
     */
    constructor(readonly pointers: PointerIndex) {
        this.pointers = pointers;
    }

    /**
     * Find the pointers from a given start and end offset within the text.
     */
    public lookup(start: number, end: number): ReadonlyArray<Pointer> {

        const result = [];

        for (let idx = start; idx < end; ++idx) {
            const pointer = this.pointers[idx];
            result.push(pointer);
        }

        return result;

    }

    /**
     * Join hits to get contiguous text on nodes that need highlights.
     */
    public join(pointers: ReadonlyArray<Pointer>): ReadonlyArray<NodeTextRegion> {

        const result: MutableNodeTextRegion[] = [];

        const siblings = createSiblings(pointers);

        for (const entry of siblings) {

            const prevNode = entry.prev?.node;
            const currNode = entry.curr.node;

            if (prevNode !== currNode) {
                // should be true on the first one so that we create an empty
                // array the first time for the first record
                result.push({
                    start: entry.curr.offset,
                    end: entry.curr.offset,
                    node: entry.curr.node
                });
            }

            result[result.length - 1].end = entry.curr.offset;

        }

        return result;

    }

    /**
     * This is the main entry point for finding text.
     */
    public find(text: string, start: number = 0): ReadonlyArray<NodeTextRegion> | undefined {

        const str = this.toString();
        const idx = str.indexOf(text, start);

        if (idx !== -1) {

            const pointers = this.lookup(idx, idx + text.length);
            return this.join(pointers);

        }

        return undefined;

    }

    public toString(): string {
        return this.pointers.map(current => current.value).join("");
    }

}

/**
 * Provides a framework to search text within a DOM and jump to to the elements
 * that contain that text.
 */
export namespace DOMTextSearch {

    export function createIndex(doc: Document = document,
                                pointers: Pointer[] = []) {

        // TODO: we DO have to factor in iframe but we have to have a pointer
        // back to the element's view ... though I am not sure about that really
        // ... I think we would just need to compute BACKWARDS to the root view.
        const blacklist = ['script', 'link', 'style', 'head', 'object', 'video', 'img'];

        // tslint:disable-next-line:no-bitwise
        const treeWalker = doc.createTreeWalker(doc.documentElement, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);

        let node;
        while (true) {

            node = treeWalker.nextNode();

            if (! node) {
                break;
            }

            if (node instanceof HTMLIFrameElement && node.contentDocument) {
                // TODO: this cold give cross origin issues...
                this.createIndex(node.contentDocument, pointers);
                continue;
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

                // console.log("'" + text + "'");

                const charPointers = CharPtrs.collapse(text);

                for (const charPointer of charPointers) {

                    const pointer: Pointer = {
                        offset: charPointer.offset,
                        node,
                        value: charPointer.value
                    };

                    pointers.push(pointer);

                }

            }

        }

        return new TextIndex(pointers);

    }

}
