import {BlockIDStr} from "./IBlock";

/**
 * A reference to another block rather than duplicating content.
 */
export interface IBlockEmbedNote {

    readonly type: 'block-embed';


    /**
     * The ID that this reference is linked to...
     */
    readonly ref: BlockIDStr;

}
