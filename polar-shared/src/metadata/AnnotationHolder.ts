import { ITextHighlight } from "./ITextHighlight";
import { IAreaHighlight } from "./IAreaHighlight";
import { IComment } from "./IComment";
import { IFlashcard } from "./IFlashcard";
import { IPageInfo } from "./IPageInfo";
import { AnnotationType } from "./AnnotationType";
import { IDocInfo } from "./IDocInfo";

/**
 * Represents a detached annotation which can be passed across the system and
 * doesn't have associated
 */
export interface AnnotationHolder {

    readonly annotationType: AnnotationType;

    readonly original: ITextHighlight | IAreaHighlight | IComment | IFlashcard;

    /**
     * Optional because in the future it might be nice to have annotations
     * which aren't strictly bound to documents.
     */
    readonly pageInfo?: IPageInfo;

    /**
     * Optional because in the future it might be nice to have annotations
     * which aren't strictly bound to documents.
     */
    readonly docInfo?: IDocInfo;

}
