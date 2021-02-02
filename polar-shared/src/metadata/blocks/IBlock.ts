import {IDStr} from "../../util/Strings";
import {ISODateTimeString} from "../ISODateTimeStrings";
import {ITextHighlight} from "../ITextHighlight";
import {IAreaHighlight} from "../IAreaHighlight";
import {IComment} from "../IComment";

export type NoteIDStr = IDStr;
export type BlockIDStr = IDStr;

export type NoteTargetStr = string;



// FIXME: would this support embed types  ?


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

}

/**
 * A regular note with markdown content.
 */
export interface IMarkdownNote extends IBlock {

    readonly type: 'markdown';
    readonly value: string;

    /**
     * Links to other notes based on the wiki links in the markdown content.
     */
    readonly links?: ReadonlyArray<NoteTargetStr>;

}

export interface INamedNote extends IBlock {
    readonly type: 'name';
    readonly value: string;
}


/**
 * A reference to another block rather than duplicating content.
 */
export interface IBlockReferenceNote {

    readonly type: 'ref';


    /**
     * The ID that this reference is linked to...
     */
    readonly ref: BlockIDStr;

}

export type LatexStr = string;

export interface ILatexNote extends IBlock {
    readonly type: 'latex';
    readonly data: LatexStr;
}

export type CodeStr = string;

export interface ICodeNote extends IBlock {
    readonly type: 'code';
    readonly lang: 'typescript' | 'javascript' | 'markdown' | 'java' | string;
    readonly value: CodeStr;
}


/**
 * Reference to a polar annotation.  We directly extend ITextHighlight and
 * IAnnotationHighlight here and reference the rest as inline metadata.
 */
interface IAnnotationNote<T, V> extends IBlock {

    readonly type: T;

    /**
     * The document ID for this highlight.
     */
    readonly docID: IDStr;

    /**
     * The page number to which this document is attached.
     */
    readonly pageNum: number;

    /**
     * The value of this note.
     */
    readonly value: V;

}

export interface ITextHighlightAnnotationNote extends IAnnotationNote<'annotation-text-highlight', ITextHighlight> {

}

export interface IAreaHighlightAnnotationNote extends IAnnotationNote<'annotation-area-highlight', IAreaHighlight> {

}

export interface ICommentAnnotationNote extends IAnnotationNote<'annotation-comment', IComment> {

}

export interface IFlashcardAnnotationNote extends IAnnotationNote<'annotation-flashcard', IComment> {

}

export type INote = IMarkdownNote |
                    INamedNote |
                    IBlockReferenceNote |
                    ILatexNote |
                    ICodeNote |
                    ITextHighlightAnnotationNote |
                    IAreaHighlightAnnotationNote |
                    ICommentAnnotationNote |
                    IFlashcardAnnotationNote
                    ;

