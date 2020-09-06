import {IPointer} from "./IPointer";
import {INodeText} from "./INodeText";
import {Whitespace} from "./Whitespace";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {DOMTextHit} from "./DOMTextHit";
import {Strings} from "polar-shared/src/util/Strings";
import {ITextLookupIndex, TextLookupIndexes} from "./TextLookupIndexes";
import {QueryRegexps} from "./QueryRegExps";
import {Arrays} from "polar-shared/src/util/Arrays";

export interface FindOpts {

    /**
     * True if we should be case insensitive
     */
    readonly caseInsensitive?: boolean;

}

export interface SearchOpts extends FindOpts {

    /**
     * The max number of hits.
     */
    readonly limit?: number;

}

export type PointerIndex = ReadonlyArray<IPointer>;

function prepareQuery(query: string) {
    return Whitespace.canonicalize(Whitespace.collapse(query));
}

export class DOMTextIndex {

    public readonly textLookupIndex: ITextLookupIndex;

    constructor(private readonly pointers: PointerIndex,
                private readonly nodeTexts: ReadonlyArray<INodeText>) {

        this.textLookupIndex = this.toTextLookupIndex();

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

    public find(query: string, opts: FindOpts = {}): DOMTextHit | undefined {
        const hits = this.search(query, 0, {...opts, limit: 1});
        return Arrays.first(hits);
    }

    /**
     * Search the DOM and find all matches.
     */
    public search(query: string,
                  start: number = 0,
                  opts: SearchOpts = {}): ReadonlyArray<DOMTextHit> {

        const regexp = QueryRegexps.toRegExp(prepareQuery(query));

        const flags = opts.caseInsensitive ? 'gi' : 'g';
        const re = new RegExp(regexp, flags);

        const toDOMTextHit = (match: RegExpExecArray): DOMTextHit => {

            // https://stackoverflow.com/questions/2295657/return-positions-of-a-regex-match-in-javascript

            const start = match.index;
            const end = start + match[0].length - 1;
            const resolvedPointers = TextLookupIndexes.resolvePointers(this.textLookupIndex.lookup, start, end);
            const id = `hit-${start}-${end}`;
            const regions =  TextLookupIndexes.mergeToRegionsByNode(resolvedPointers);
            return {id, regions};
        }

        const result: DOMTextHit[] = [];

        while(true) {

            const match = re.exec(this.textLookupIndex.text);

            if (opts.limit !== undefined && result.length >= opts.limit) {
                break;
            }

            if (! match) {
                break;
            }

            const hit = toDOMTextHit(match);
            result.push(hit)

        }

        return result;

    }

    public toTextLookupIndex(): ITextLookupIndex {

        const nodePointers = this.nodeTexts
                                 .map(current => current.pointers)
                                 .filter(current => current.length > 0)

        function toLookup(): ReadonlyArray<IPointer> {
            return arrayStream(nodePointers)
                    .map(current => {
                        return [...current]
                    })
                    .flatMap(current => current)
                    .collect();
        }

        /**
         * Convert all the whitespace in the string to to ' ' (AKA space)
         */
        function canonicalizeWhitespace(c: string): string {

            if (Strings.isWhitespace(c)) {
                return ' ';
            } else {
                return c;
            }

        }

        function toText(): string {

            function toText(pointers: ReadonlyArray<IPointer>) {
                // we canonicalize the whitespace here so that debuging is made
                // a bit easier but it's not strictly required.
                return pointers.map(current => canonicalizeWhitespace(current.value))
                               .join("");
            }

            return nodePointers.map(toText)
                               .join("");

        }


        const text = toText();
        const lookup = toLookup();

        // if (text.length !== lookup.length) {
        //     throw new Error(`Invalid text and lookup computation: ${text.length} vs ${lookup.length}`);
        // }

        return {text, lookup};

    }

    public toString() {
        return this.textLookupIndex.text;
    }

}
