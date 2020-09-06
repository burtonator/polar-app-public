import {DOMTextHit} from "./DOMTextHit";
import {NodeTextRegion} from "./NodeTextRegion";
import {PlainTextStr} from "polar-shared/src/util/Strings";

export namespace DOMTextHits {

    export function extract(hits: ReadonlyArray<DOMTextHit>): PlainTextStr {

        function hitToText(hit: DOMTextHit): string {

            function regionToText(region: NodeTextRegion): string {

                // end is not-inclusive.
                return region.node.textContent!.substring(region.start, region.end + 1);
            }

            return hit.regions.map(regionToText).join("");

        }

        return hits.map(hitToText).join("");

    }

}
