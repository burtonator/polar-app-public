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
import {Refs} from "../Refs";
import {IVersionedObject} from "../IVersionedObject";

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

    public delete(annotationRef: IAnnotationRefWithDocMeta): boolean {

        const {docMeta} = annotationRef;

        const pageMeta = IDocMetas.getPageMeta(docMeta, annotationRef.pageNum);

        const values = this.toValues(pageMeta) || {};

        let deleted: boolean = false;

        if (values[annotationRef.id]) {
            console.log("Deleted record: ", annotationRef);
            delete values[annotationRef.id];
            deleted = true;
        }

        function getImage(): IImage | undefined {

            if (annotationRef.annotationType === AnnotationType.AREA_HIGHLIGHT) {
                return (<IAreaHighlight> annotationRef.original).image;
            }

            if (annotationRef.annotationType === AnnotationType.TEXT_HIGHLIGHT) {
                return (<ITextHighlight> annotationRef.original).image;
            }

            return undefined;
        }

        const image = getImage();

        if (image && isPresent(docMeta.docInfo.attachments)) {
            delete docMeta.docInfo.attachments[image.id];
        }


        const ref = Refs.createFromAnnotationType(annotationRef.id, annotationRef.annotationType);

        const deleteChildren = (children: {[id: string]: IVersionedObject}) => {

            const dependencies = Object.values(children || {})
                .filter(current => current.ref === ref);

            for (const dependency of dependencies) {
                delete children[dependency.id];
            }

        }

        deleteChildren(pageMeta.comments);
        deleteChildren(pageMeta.flashcards);

        log.warn("Failed to delete value: ", annotationRef);

        return deleted;

    }

    protected abstract toValues(pageMeta: IPageMeta): IDValueMap<V> | undefined;

}
