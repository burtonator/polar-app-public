import {IDocMeta} from "../IDocMeta";
import {IPageMeta, PageNumber} from "../IPageMeta";
import {Logger} from "../../logger/Logger";
import {ISODateTimeStrings} from "../ISODateTimeStrings";
import {IAnnotationTypeRef, IIDRef, IPageRef} from "../AnnotationRefs";
import {arrayStream} from "../../util/ArrayStreams";

const log = Logger.create();

export interface IPageMetaMutationRef extends IIDRef, IPageRef {
}

export interface IAnnotationMutationRef extends IPageRef, IAnnotationTypeRef {
    readonly docMeta: IDocMeta;
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

    public update(ref: IAnnotationMutationRef, value: V): boolean {

        const {docMeta} = ref;

        // FIXME: with the pageNum we don't have to scan now.

        return this.forEachPageMeta(docMeta, (pageMeta, values) => {

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

        });

    }

    public delete(ref: IAnnotationMutationRef, value: V): boolean {

        const {docMeta} = ref;

        const result = this.forEachPageMeta(docMeta, (pageMeta, values) => {

            if (values[value.id]) {
                delete values[value.id];
                return true;
            }

            return false;

        });

        if (! result) {
            log.warn("Failed to delete value: ", value);
        } else {
            console.log("Deleted record: ", value);
        }

        return result;

    }

    protected abstract toValues(pageMeta: IPageMeta): IDValueMap<V> | undefined;

    private forEachPageMeta(docMeta: IDocMeta, callback: ValueCallback<V>): boolean {

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const values = this.toValues(pageMeta) || {};

            if (callback(pageMeta, values)) {
                return true;
            }

        }

        return false;

    }

}
