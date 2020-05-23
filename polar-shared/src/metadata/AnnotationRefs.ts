/**
 * A reference to an annotation which we might want to work with.
 */
import {IDStr} from "../util/Strings";
import {AnnotationType} from "./AnnotationType";
import {PageNumber} from "./IPageMeta";

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

export interface IAnnotationRef extends IIDRef, IPageRef, IAnnotationTypeRef {
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
