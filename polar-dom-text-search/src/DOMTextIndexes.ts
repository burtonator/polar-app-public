import {DOMTextIndex} from "./DOMTextIndex";
import {IPointer} from "./IPointer";
import {INodeText} from "./INodeText";
import {CharPointers} from "./CharPointers";
import { Preconditions } from "polar-shared/src/Preconditions";

export namespace DOMTextIndexes {

    export function create(doc: Document = document,
                           root: Node = document.body): DOMTextIndex {

        Preconditions.assertPresent(doc, 'doc');
        Preconditions.assertPresent(root, 'root');

        const pointers: IPointer[] = [];
        const nodeTexts: INodeText[] = [];

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
                this.createIndex(node.contentDocument, node.contentDocument.body);
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
                const nodeID = index++;
                const charPointers = CharPointers.parse(text);
                const newPointers = CharPointers.toPointers(nodeID, node, charPointers);
                pointers.push(...newPointers);
                nodeTexts.push({nodeID, node, text, pointers: newPointers})

            }

        }

        return new DOMTextIndex(pointers, nodeTexts);

    }

}
