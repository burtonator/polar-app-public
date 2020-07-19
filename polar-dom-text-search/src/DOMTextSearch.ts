import {CharPointers} from "./CharPointers";
import {Preconditions} from "polar-shared/src/Preconditions";
import {TextIndex} from "./TextIndex";
import {IPointer, PointerType} from "./IPointer";

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

                // FIXME: I need a BETTER grand unified theory for dealing with
                // white text or we're going to have a LOT of bugs...

                // FIXME: one each node we fine the FIRST and LAST non-whitespace
                // but we

                const text = nodeValue;

                const charPointers = CharPointers.collapse(text);

                const idx = index++;

                for (const charPointer of charPointers) {

                    const pointer: IPointer = {
                        idx,
                        offset: charPointer.offset,
                        node,
                        value: charPointer.value,
                        type: PointerType.Literal
                    };

                    pointers.push(pointer);

                }

                pointers.push({
                    idx,
                    offset: text.length,
                    node,
                    value: ' ',
                    type: PointerType.Padding
                })

                nodeTexts.push({idx, node, text: text + ' '})

            }

        }

        return new TextIndex(pointers, nodeTexts);

    }

}
