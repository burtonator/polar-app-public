export enum PointerType {
    Literal, Padding, ExcessiveWhitespace
}

export interface IPointerBase {

    /**
     * The value of this character in text.
     */
    readonly value: string;

    /**
     * The offset into this node that the character is stored.
     */
    readonly offset: number;

    readonly type: PointerType;

}

export interface IPointer extends IPointerBase {

    /**
     * A unique ID value for this node/pointer.
     */
    readonly nodeID: number;

    /**
     * The node for this item.
     */
    readonly node: Node;

}
