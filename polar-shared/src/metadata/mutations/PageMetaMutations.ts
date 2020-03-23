import {IDocMeta} from "../IDocMeta";
import {IPageMeta} from "../IPageMeta";
import {IDStr} from "../../util/Strings";
import {Logger} from "../../logger/Logger";
import {Hashcodes} from "../../util/Hashcodes";
import {ISODateTimeStrings} from "../ISODateTimeStrings";

const log = Logger.create();

export interface IDValue {
    readonly id: IDStr;
}

export interface IDValueMap<V extends IDValue> {
    [id: string]: V;
}

export type ValueCallback<V extends IDValue> = (pageMeta: IPageMeta, values: IDValueMap<V>) => boolean;

export abstract class MutatorDelegate<V extends IDValue> {

    public update(docMeta: IDocMeta, value: V): boolean {

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

    public delete(docMeta: IDocMeta, value: V): boolean {

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

    protected abstract toValues(pageMeta: IPageMeta): IDValueMap<V> | null | undefined;

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
