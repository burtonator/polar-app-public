/**
 * A reference to an annotation which we might want to work with.
 */
import {IDStr} from "../util/Strings";
import {AnnotationType} from "./AnnotationType";
import {PageNumber} from "./IPageMeta";
import { IDocMeta } from "./IDocMeta";
import { DocMetas } from "./DocMetas";

export interface IAnnotationRef {
    readonly id: IDStr;
    readonly annotationType: AnnotationType;
    readonly pageNum: PageNumber;
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
