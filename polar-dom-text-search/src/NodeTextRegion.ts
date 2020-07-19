export interface MutableNodeTextRegion {
    readonly nodeID: number;
    start: number;
    end: number;
    node: Node;
}


export interface NodeTextRegion extends Readonly<MutableNodeTextRegion> {
}
