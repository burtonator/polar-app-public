import {IPointer} from "./IPointer";
import {MutableNodeTextRegion, NodeTextRegion} from "./NodeTextRegion";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Arrays} from "polar-shared/src/util/Arrays";

export interface ITextLookupIndex {

    /**
     * The text of the content.
     */
    readonly text: string;

    /**
     * The pointer lookup.  The value could be undefined which means it's just
     * whitespace
     */
    readonly lookup: ReadonlyArray<IPointer>;

}

export namespace TextLookupIndexes {

    /**
     * Find the pointers from a given start and end offset within the text.
     */
    export function resolvePointers(lookup: ReadonlyArray<IPointer>,
                                    start: number,
                                    end: number): ReadonlyArray<IPointer> {

        const result = [];

        for (let idx = start; idx <= end; ++idx) {
            const pointer = lookup[idx];
            result.push(pointer);
        }

        return result;

    }

    export function mergeToRegionsByNode(pointers: ReadonlyArray<IPointer>): ReadonlyArray<NodeTextRegion> {


        function createMerger() {

            return (block: ReadonlyArray<IPointer>) => {

                const first = Arrays.first(block)!;
                const last = Arrays.last(block)!;

                const region: MutableNodeTextRegion = {
                    nodeID: first.nodeID,
                    start: first.offset,
                    end: last.offset,
                    node: first.node
                };

                return region;

            }

        }

        return arrayStream(pointers)
            .group(current => '' + current.nodeID)
            .filter(current => current.length > 0)
            .map(createMerger())
            .collect();

    }

}
