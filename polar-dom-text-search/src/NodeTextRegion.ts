export interface MutableNodeTextRegion {
    nodeID: number;
    start: number;

    /**
     * End of the region (inclusive)
     */
    end: number;
    node: Node;
}


export interface NodeTextRegion extends Readonly<MutableNodeTextRegion> {
}
