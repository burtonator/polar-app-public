/**
 * A reference to an annotation which we might want to work with.
 */
import {IDStr} from "../util/Strings";
import {AnnotationType} from "./AnnotationType";
import {PageNumber} from "./IPageMeta";
import {IDocMeta} from "./IDocMeta";
import { IComment } from "./IComment";
import {IFlashcard} from "./IFlashcard";
import {IAreaHighlight} from "./IAreaHighlight";
import {ITextHighlight} from "./ITextHighlight";

/**
 * References by ID.
 */
export interface IIDRef {
    readonly id: IDStr;
}

/**
 * References a page
 */
export interface IPageRef {
    readonly pageNum: PageNumber;
}

/**
 * References by annotation type.
 */
export interface IAnnotationTypeRef {
    readonly annotationType: AnnotationType;
}

export interface IDocMetaRef {
    readonly id: IDStr;
}

/**
 * Interface that has a docMeta.
 */
export interface IDocMetaHolder {
    readonly docMeta: IDocMeta;
}

export interface IAnnotationRef extends IIDRef, IPageRef, IAnnotationTypeRef {
    readonly original: IComment | IFlashcard | IAreaHighlight | ITextHighlight;
    readonly docMetaRef: IDocMetaRef;
}

export interface IAnnotationRefWithDocMeta extends IAnnotationRef, IDocMetaHolder {
    readonly docMetaRef: IDocMetaRef;
}

export namespace AnnotationRefs {

    // export function resolve(docMeta: IDocMeta,
    //                         refs: ReadonlyArray<IAnnotationRef>) {
    //
    //     function doResolve(ref: IAnnotationRef) {
    //         const pageMeta = DocMetas.getPageMeta(docMeta, ref.pageNum);
    //     }
    //
    // }

}
