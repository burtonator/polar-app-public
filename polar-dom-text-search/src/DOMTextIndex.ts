import {createSiblings} from "polar-shared/src/util/Functions";
import {IPointer, PointerType} from "./IPointer";
import {INodeText} from "./INodeText";
import {Whitespace} from "./Whitespace";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {NodeTextRegion, MutableNodeTextRegion} from "./NodeTextRegion";
import {DOMTextHit} from "./DOMTextHit";
import { isPresent } from "polar-shared/src/Preconditions";

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

        for (let idx = start; idx <= end; ++idx) {
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

function prepareQuery(query: string, opts: SearchOpts) {
    return Whitespace.collapse(opts.caseInsensitive ? query.toLocaleLowerCase() : query);
}


interface TextLookupIndexCache {
    readonly insensitive: TextLookupIndex;
    readonly sensitive: TextLookupIndex;
}

export class DOMTextIndex {

    private readonly textLookupIndexCache: TextLookupIndexCache;

    constructor(private readonly pointers: PointerIndex,
                private readonly nodeTexts: ReadonlyArray<INodeText>) {

        this.textLookupIndexCache = {
            sensitive: this.toTextLookupIndex({caseInsensitive: false}),
            insensitive: this.toTextLookupIndex({caseInsensitive: true})
        };

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
    private find0(query: string,
                  start: number = 0,
                  textLookupIndex: TextLookupIndex): DOMTextHit | undefined {

        if ( ! isPresent(query) || query === '') {
            // not sure this is the best way to handle this but this isn't a
            // real query and will sort of be very expensive to execute.
            return undefined;
        }

        const {text, lookup} = textLookupIndex;

        const idx = text.indexOf(query, start);

        if (idx !== -1) {
            const start = idx;
            const end = idx + query.length;
            const resolvedPointers = TextLookupIndexes.lookup(lookup, start, end);
            const id = `hit-${start}-${end}`;
            const regions =  TextLookupIndexes.join(resolvedPointers);
            const resume = idx + query.length;
            return {id, regions, resume};
        }

        // no hits...
        return undefined;

    }

    private getTextLookupIndex(opts: SearchOpts): TextLookupIndex {
        return opts.caseInsensitive ? this.textLookupIndexCache.insensitive : this.textLookupIndexCache.sensitive;
    }

    public find(rawQuery: string, opts: SearchOpts = {}): DOMTextHit | undefined {
        const textLookupIndex = this.getTextLookupIndex(opts);
        const query = prepareQuery(rawQuery, opts);
        return this.find0(query, 0, textLookupIndex);
    }

    /**
     * Search the DOM and find all matches.
     */
    public search(rawQuery: string,
                  start: number = 0,
                  opts: SearchOpts = {}): ReadonlyArray<DOMTextHit> {

        const textLookupIndex = this.getTextLookupIndex(opts);
        const query = prepareQuery(rawQuery, opts);

        const result: DOMTextHit[] = [];

        let idx = start;

        while(true) {

            const hit = this.find0(query, idx, textLookupIndex);

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
                            .filter(current => current.length > 0)
                            .map(toText)
                            .join(" ");

            return opts.caseInsensitive ? raw.toLocaleLowerCase() : raw;

        }


        const text = toText();
        const lookup = toLookup();

        return {text, lookup};

    }

    public toString() {
        return this.textLookupIndexCache.sensitive.text;
    }

}
