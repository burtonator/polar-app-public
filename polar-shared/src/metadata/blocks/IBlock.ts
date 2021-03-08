import {IDStr} from "../../util/Strings";
import {ISODateTimeString} from "../ISODateTimeStrings";
import {ITextHighlight} from "../ITextHighlight";
import {IAreaHighlight} from "../IAreaHighlight";
import {IComment} from "../IComment";

export type NoteIDStr = IDStr;
export type BlockIDStr = IDStr;

export type NoteTargetStr = string;

export type GraphIDStr = string;

/**
 * Blocks are a container object for content.
 *
 * Content objects are containers for data.
 *
 * Data is more raw.
 *
 * Blocks allow for IDs, the uid (owner of the block), and any hcild items (if any).
 *
 */
export interface IBlock {

    readonly id: BlockIDStr;

    /**
     * The root node of this tree.  If this block is the root the root and the
     * id are the same.
     */
    readonly root: NoteIDStr;

    /**
     * The graph to which this page belongs.
     */
    readonly graph: GraphIDStr;

    readonly parent: NoteIDStr | undefined;

    /**
     * The owner of this block.
     */
    readonly uid: string;

    /**
     * The version of this block so we can have multiple but compatible versions
     * in the same store.
     */
    readonly ver: 'v1';

    /**
     * The sub-items of this node as node IDs.  All blocks should have
     * items/children because an embed or a latex note wouldn't be able to have
     * children.
     */
    readonly items?: ReadonlyArray<NoteIDStr>;

    readonly created: ISODateTimeString;

    readonly updated: ISODateTimeString;

    // readonly shares?:

}



