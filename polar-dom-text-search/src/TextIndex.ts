import {
    DOMTextHit,
    MutableNodeTextRegion,
    NodeTextRegion,
    PointerIndex,
} from "./DOMTextSearch";
import {createSiblings} from "polar-shared/src/util/Functions";
import {IPointer, PointerType} from "./IPointer";
import {CharPointer} from "./CharPointers";
import { INodeText } from "./INodeText";
import { Whitespace } from "./Whitespace";

export interface SearchOpts {
    readonly caseInsensitive?: boolean;
}

export interface ToStringOpts {
    readonly caseInsensitive?: boolean;
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
     * Join hits to get contiguous text on nodes that need highlights.
     */
    public join(pointers: ReadonlyArray<IPointer>): ReadonlyArray<NodeTextRegion> {

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
    public find(query: string,
                start: number = 0,
                opts: SearchOpts = {}): DOMTextHit | undefined {

        const toQuery = () => {
            return Whitespace.collapse(opts.caseInsensitive ? query.toLocaleLowerCase() : query);
        }

        // FIXME: this i super inefficient as each time we call 'find' we're
        // recomputing the string indes

        const toStr = () => {
            return this.toString({caseInsensitive: opts.caseInsensitive})
        }

        query = toQuery();
        const str = toStr();

        if (query === '') {
            // not sure this is the best way to handle this but this isn't a
            // real query and will sort of be very expensive to execute.
            return undefined;
        }

        const idx = str.indexOf(query, start);

        // FIXME: this is the bug because the look is wrong.. we have to have toStr()
        // return a toStringLookup or somethign along those lines where we can
        // take the index in the string and lookup the pointer in the original..

        if (idx !== -1) {
            const pointers = this.lookup(idx, idx + query.length);
            const regions =  this.join(pointers);
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

        const result: DOMTextHit[] = [];

        let idx = start;

        while(true) {

            const hit = this.find(query, idx, opts);

            if (! hit) {
                break;
            }

            result.push(hit);
            idx = hit.resume;

        }

        return result;

    }

    public toString(opts: ToStringOpts = {}): string {

        // FIXME: this has to create TWO indexes... one is the text representation
        // and the other is a lookup that can find the pointer back to the node
        // and its original offset.
        const join = () => {

            function toText(charPointers: ReadonlyArray<CharPointer>) {
                // FIXME: these offsets look right...
                return charPointers.filter(current => current.type !== PointerType.ExcessiveWhitespace)
                                   .map(current => current.value)
                                   .join("")
            }

            return this.nodeTexts
                       .map(current => current.charPointers)
                       .map(toText)
                       .filter(current => current !== '')
                       .join(" ");

        }

        const joined = join().trim();

        if (opts.caseInsensitive) {
            return joined.toLocaleLowerCase();
        }

        return joined;

    }

}
