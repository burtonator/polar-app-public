import {IPageMeta, PageNumber} from "../IPageMeta";
import {Logger} from "../../logger/Logger";
import {ISODateTimeStrings} from "../ISODateTimeStrings";
import {IAnnotationRefWithDocMeta, IIDRef, IPageRef} from "../AnnotationRefs";
import {arrayStream} from "../../util/ArrayStreams";
import {IDocMetas} from "../IDocMetas";
import {AnnotationType} from "../AnnotationType";
import {IAreaHighlight} from "../IAreaHighlight";
import {IImage} from "../IImage";
import {ITextHighlight} from "../ITextHighlight";
import {isPresent} from "../../Preconditions";

const log = Logger.create();

export interface IPageMetaMutationRef extends IIDRef, IPageRef {
}

export namespace PageMetaMutations {

    export function convert(map: {[id: string]: IIDRef} | null | undefined, pageNum: PageNumber): Readonly<{[id: string]: IPageMetaMutationRef}> {

        function toPageMetaMutationRef(current: IIDRef): IPageMetaMutationRef {
            return {
                id: current.id,
                pageNum
            };
        }

        return arrayStream(Object.values(map || {}))
                .map(toPageMetaMutationRef)
                .toMap(current => current.id);

    }

}

export interface IDValueMap<V extends IIDRef> {
    [id: string]: V;
}

export type ValueCallback<V extends IIDRef> = (pageMeta: IPageMeta, values: IDValueMap<V>) => boolean;

export abstract class MutatorDelegate<V extends IIDRef> {

    public update(ref: IAnnotationRefWithDocMeta, value: V): boolean {

        const {docMeta} = ref;

        const pageMeta = IDocMetas.getPageMeta(docMeta, ref.pageNum);
        const values = this.toValues(pageMeta) || {};

        // we have to delete the existing object by ID, then also set the
        // lastUpdated field, then replace both of these fields, and update
        // the object.

        // TODO: this is probably wrong. I want to migrate to a way to make
        // the annotations completely immutable so that every mutation
        // creates a new annotation with a new ID but the same GUID but there
        // are some serious bugs about implementing this.
        const id = value.id;
        const lastUpdated = ISODateTimeStrings.create();

        if (values[value.id]) {
            // delete values[value.id];
            values[id] = {...value, id, lastUpdated};
            return true;
        }

        return false;

    }

    public delete(ref: IAnnotationRefWithDocMeta): boolean {

        const {docMeta} = ref;

        const pageMeta = IDocMetas.getPageMeta(docMeta, ref.pageNum);

        const values = this.toValues(pageMeta) || {};

        if (values[ref.id]) {
            console.log("Deleted record: ", ref);
            delete values[ref.id];
            return true;
        }

        function getImage(): IImage | undefined {

            if (ref.annotationType === AnnotationType.AREA_HIGHLIGHT) {
                return (<IAreaHighlight> ref.original).image;
            }

            if (ref.annotationType === AnnotationType.TEXT_HIGHLIGHT) {
                return (<ITextHighlight> ref.original).image;
            }

            return undefined;
        }

        const image = getImage();

        if (image && isPresent(docMeta.docInfo.attachments)) {
            delete docMeta.docInfo.attachments[image.id];
        }

        log.warn("Failed to delete value: ", ref);
        return false;


    }

    protected abstract toValues(pageMeta: IPageMeta): IDValueMap<V> | undefined;

}
