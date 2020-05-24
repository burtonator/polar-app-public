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
import {IPagemark} from "./IPagemark";

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

/**
 * Basic metadata about an annotation, without any "structural" information like
 * the DocMetaRef or the original annotation.
 */
export interface IAnnotationMeta extends IIDRef, IPageRef, IAnnotationTypeRef {

}

export interface IAnnotationRef extends IAnnotationMeta {
    readonly docMetaRef: IDocMetaRef;
    readonly original: IPagemark | IComment | IFlashcard | IAreaHighlight | ITextHighlight;
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
