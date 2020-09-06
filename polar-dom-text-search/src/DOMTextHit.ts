import {NodeTextRegion} from "./NodeTextRegion";

/**
 * Represents an individual hit when running a find...
 */
export interface DOMTextHit {

    /**
     * Unique ID for this text hit.
     */
    readonly id: string;

    /**
     * The DOM regions and the text that was a match.
     */
    readonly regions: ReadonlyArray<NodeTextRegion>;

}
