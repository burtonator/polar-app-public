export interface IPointer {

    /**
     * A unique ID value for this node/pointer.
     */
    readonly idx: number;

    /**
     * The value of this character in text.
     */
    readonly value: string;

    /**
     * The offset into this node that the character is stored.
     */
    readonly offset: number;

    /**
     * The node for this item.
     */
    readonly node: Node;

}

