import {createSiblings} from "polar-shared/src/util/Functions";
import {IPointer, PointerType} from "./IPointer";
import {INodeText} from "./INodeText";
import {Whitespace} from "./Whitespace";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {NodeTextRegion, MutableNodeTextRegion} from "./NodeTextRegion";
import {DOMTextHit} from "./DOMTextHit";

export interface SearchOpts {
    readonly caseInsensitive?: boolean;
}

export interface ToStringOpts {
    readonly caseInsensitive?: boolean;
}

export type PointerIndex = ReadonlyArray<IPointer>;

interface TextLookupIndex {

    /**
     * The text of the content.
     */
    readonly text: string;

    /**
     * The pointer lookup.  The value could be undefined which means it's just
     * whitespace
     */
    readonly lookup: ReadonlyArray<IPointer | undefined>;

}

namespace TextLookupIndexes {

    /**
     * Find the pointers from a given start and end offset within the text.
     */
    export function lookup(lookup: ReadonlyArray<IPointer | undefined>,
                           start: number,
                           end: number): ReadonlyArray<IPointer> {

        const result = [];

        for (let idx = start; idx < end; ++idx) {
            const pointer = lookup[idx];

            if (pointer) {
                result.push(pointer);

            }
        }

       return result;

    }


    /**
     * Join hits to get contiguous text on nodes that need highlights.
     */
    export function join(pointers: ReadonlyArray<IPointer>): ReadonlyArray<NodeTextRegion> {

        const result: MutableNodeTextRegion[] = [];

        const siblings = createSiblings(pointers);

        for (const entry of siblings) {

            const prevNode = entry.prev?.node;
            const currNode = entry.curr.node;

            if (entry.curr.type === 'padding') {
                continue;
            }

            if (prevNode !== currNode) {
                // should be true on the first one so that we create an empty
                // array the first time for the first record
                result.push({
                    nodeID: entry.curr.nodeID,
                    start: entry.curr.offset,
                    end: entry.curr.offset,
                    node: entry.curr.node
                });
            }

            result[result.length - 1].end = entry.curr.offset;

        }

        return result;

    }

}

export class TextIndex {

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
     * Search and find just one match.
     */
    private find(query: string,
                 start: number = 0,
                 textLookupIndex: TextLookupIndex): DOMTextHit | undefined {

        if (query === '') {
            // not sure this is the best way to handle this but this isn't a
            // real query and will sort of be very expensive to execute.
            return undefined;
        }

        const {text, lookup} = textLookupIndex;


        const idx = text.indexOf(query, start);

        if (idx !== -1) {
            const resolvedPointers = TextLookupIndexes.lookup(lookup, idx, idx + query.length);
            const regions =  TextLookupIndexes.join(resolvedPointers);
            const resume = idx + query.length;
            return {regions, resume};
        }

        // no hits...
        return undefined;

    }

    /**
     * Search the DOM and find all matches.
     */
    public search(query: string,
                  start: number = 0,
                  opts: SearchOpts = {}): ReadonlyArray<DOMTextHit> {

        const toQuery = () => {
            return Whitespace.collapse(opts.caseInsensitive ? query.toLocaleLowerCase() : query);
        }

        const textLookupIndex = this.toTextLookupIndex({caseInsensitive: opts.caseInsensitive});
        query = toQuery();

        const result: DOMTextHit[] = [];

        let idx = start;

        while(true) {

            const hit = this.find(query, idx, textLookupIndex);

            if (! hit) {
                break;
            }

            result.push(hit);
            idx = hit.resume;

        }

        return result;

    }

    public toTextLookupIndex(opts: ToStringOpts = {}): TextLookupIndex {

        function filteredPointers(pointers: ReadonlyArray<IPointer>) {
            return pointers.filter(current => current.type !== PointerType.ExcessiveWhitespace)
        }

        // pointers for each node in the DOM
        const nodePointers = this.nodeTexts
                                 .map(current => current.pointers)
                                 .map(current => filteredPointers(current));

        function toLookup(): ReadonlyArray<IPointer | undefined> {

            return arrayStream(nodePointers)
                    .map(current => {
                        return [...current, undefined]
                    })
                    .flatMap(current => current)
                    .collect();

        }

        function toText(): string {

            function toText(pointers: ReadonlyArray<IPointer>) {
                return pointers.map(current => current.value)
                               .join("");
            }

            const raw = nodePointers
                            .map(toText)
                            .join(" ");

            return opts.caseInsensitive ? raw.toLocaleLowerCase() : raw;

        }

        const text = toText();
        const lookup = toLookup();

        return {text, lookup};

    }

}
