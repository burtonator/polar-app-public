import {IDStr} from "../../util/Strings";
import {IBlock} from "./IBlock";
import {ITextHighlight} from "../ITextHighlight";
import {IAreaHighlight} from "../IAreaHighlight";
import {IComment} from "../IComment";

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
