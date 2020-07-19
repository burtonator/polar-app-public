import {NodeTextRegion} from "./NodeTextRegion";

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
