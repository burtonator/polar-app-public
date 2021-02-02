import {IDStr} from "../../util/Strings";
import {ISODateTimeString} from "../ISODateTimeStrings";
import {ITextHighlight} from "../ITextHighlight";
import {IAreaHighlight} from "../IAreaHighlight";
import {IComment} from "../IComment";

export type NoteIDStr = IDStr;
export type BlockIDStr = IDStr;

export type NoteTargetStr = string;

/**
 * Markdown data.
 */
export interface IMarkdownData {
    readonly type: 'markdown';
    readonly value: string;
}

/**
 * Name data represents a node, by name, that has a restricted set of
 * characters for a named node reference.
 */
export interface INameData {
    readonly type: 'name';
    readonly value: string;
}

export type ILatexData = string;

/**
 * A note with markdown content.
 */
export interface INoteContent {

    readonly data: IMarkdownData | INameData;

    readonly type: 'note';

    /**
     * The linked wiki references to other notes.
     */
    readonly links?: ReadonlyArray<NoteTargetStr>;

}

/**
 * A reference to another block rather than duplicating content.
 */
export interface IBlockReferenceContent {

    readonly type: 'reference';

    /**
     * The ID that this reference is linked to...
     */
    readonly id: BlockIDStr;

}

/**
 * Reference to a polar annotation.  We directly extend ITextHighlight and
 * IAnnotationHighlight here and reference the rest as inline metadata.
 */
interface IAnnotationContent<T, D> {

    readonly type: T;

    readonly id: IDStr;

    /**
     * The document ID for this highlight.
     */
    readonly docID: IDStr;

    /**
     * The page number to which this document is attached.
     */
    readonly pageNum: number;

    readonly data: D

}

export interface ITextHighlightAnnotationContent extends IAnnotationContent<'annotation-text-highlight', ITextHighlight> {

}

export interface IAreaHighlightAnnotationContent extends IAnnotationContent<'annotation-area-highlight', IAreaHighlight> {

}

export interface ICommentAnnotationContent extends IAnnotationContent<'annotation-comment', IComment> {

}

export interface IFlashcardAnnotationContent extends IAnnotationContent<'annotation-flashcard', IComment> {

}


export interface ILatexContent {
    readonly type: 'latex';
    readonly data: ILatexData;
}

export interface ICodeData {
    readonly lang: 'typescript' | 'javascript' | 'markdown' | string;
    readonly value: string;
}

export interface ICodeContent {
    readonly type: 'code';
    readonly data: ICodeData;
}

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

    readonly content: INoteContent |
                      IBlockReferenceContent |
                      ILatexContent |
                      ICommentAnnotationContent |
                      ITextHighlightAnnotationContent |
                      IAreaHighlightAnnotationContent |
                      IFlashcardAnnotationContent;

}
