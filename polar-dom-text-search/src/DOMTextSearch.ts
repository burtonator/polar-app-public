import {createSiblings} from "polar-shared/src/util/Functions";
import {CharPtrs} from "./CharPtrs";
import {Preconditions} from "polar-shared/src/Preconditions";

export interface IPointer {

    /**
     * A unique ID value for this node/pointer.
     */
    readonly idx: number;

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

interface INodeText {
    readonly idx: number;
    readonly node: Node;
    readonly text: string;
}

export interface SearchOpts {
    readonly caseInsensitive?: boolean;
}

export interface ToStringOpts {
    readonly caseInsensitive?: boolean;
}

export interface MutableNodeTextRegion {
    idx: number;
    start: number;
    end: number;
    node: Node;
}

export interface NodeTextRegion extends Readonly<MutableNodeTextRegion> {
}

export type PointerIndex = ReadonlyArray<IPointer>;

/**
 * Represents an individual hit when running a find...
 */
export interface DOMTextHit {

    /**
     * The DOM regions and the text that was a match.
     */
    readonly regions: ReadonlyArray<NodeTextRegion>;

    /**
     * Where to resume when searching again.
     */
    readonly resume: number;

}

export class TextIndex {

    /**
     *
     * @param pointers allows us to lookup the node and offset of the text any text we index.
     */
    constructor(private readonly pointers: PointerIndex,
                private readonly nodeTexts: ReadonlyArray<INodeText>) {

    }

    /**
     * Find the pointers from a given start and end offset within the text.
     */
    public lookup(start: number, end: number): ReadonlyArray<IPointer> {

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
    public join(pointers: ReadonlyArray<IPointer>): ReadonlyArray<NodeTextRegion> {

        const result: MutableNodeTextRegion[] = [];

        const siblings = createSiblings(pointers);

        for (const entry of siblings) {

            const prevNode = entry.prev?.node;
            const currNode = entry.curr.node;

            if (prevNode !== currNode) {
                // should be true on the first one so that we create an empty
                // array the first time for the first record
                result.push({
                    idx: entry.curr.idx,
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
     * Search and find just one match.
     */
    public find(text: string,
                start: number = 0,
                opts: SearchOpts = {}): DOMTextHit | undefined {

        const str = this.toString({caseInsensitive: opts.caseInsensitive});

        console.log("FIXME: str: ", str);

        const idx = str.indexOf(text, start);

        if (idx !== -1) {
            const pointers = this.lookup(idx, idx + text.length);
            const regions =  this.join(pointers);
            const resume = idx + text.length;
            return {regions, resume};
        }

        // no hits...
        return undefined;

    }

    /**
     * Search the DOM and find all matches.
     */
    public search(text: string,
                  start: number = 0,
                  opts: SearchOpts = {}): ReadonlyArray<DOMTextHit> {

        // FIXME: how to make this case insensitive???

        if (text === '') {
            // not sure this is the best way to handle this but this isn't a
            // real query and will sort of be very expensive to execute.
            return [];
        }

        const result: DOMTextHit[] = [];

        let idx = start;

        while(true) {

            const hit = this.find(text, idx, opts);

            if (! hit) {
                break;
            }

            result.push(hit);
            idx = hit.resume;

        }

        return result;

    }

    public toString(opts: ToStringOpts = {}): string {

        const join = () => {
            return this.nodeTexts
                       .map(current => current.text.trim())
                       .join(" ");
        }

        const joined = join();

        if (opts.caseInsensitive) {
            return joined.toLocaleLowerCase();
        }

        return joined;

    }

}

/**
 * Provides a framework to search text within a DOM and jump to to the elements
 * that contain that text.
 */
export namespace DOMTextSearch {

    export function createIndex(doc: Document = document,
                                root: HTMLElement = document.documentElement) {

        const pointers: IPointer[] = [];
        const nodeTexts: INodeText[] = [];

        Preconditions.assertPresent(doc, 'doc');
        Preconditions.assertPresent(root, 'root');

        // TODO: we DO have to factor in iframe but we have to have a pointer
        // back to the element's view ... though I am not sure about that really
        // ... I think we would just need to compute BACKWARDS to the root view.
        const blacklist = ['script', 'link', 'style', 'head', 'object', 'video', 'img'];

        // tslint:disable-next-line:no-bitwise
        const treeWalker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);

        // the node index so that we can create a new pointer for each node.
        let index = 0;
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

                const idx = index++;

                for (const charPointer of charPointers) {

                    const pointer: IPointer = {
                        idx,
                        offset: charPointer.offset,
                        node,
                        value: charPointer.value
                    };

                    pointers.push(pointer);

                }

                nodeTexts.push({idx, node, text})

            }

        }

        return new TextIndex(pointers, nodeTexts);

    }

}
