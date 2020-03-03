import {IDocMeta} from "../IDocMeta";
import {IPageMeta} from "../IPageMeta";
import {IDStr} from "../../util/Strings";

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

            if (values[value.id]) {
                values[value.id] = value;
                return true;
            }

            return false;

        });

    }

    public delete(docMeta: IDocMeta, value: V): boolean {

        return this.forEachPageMeta(docMeta, (pageMeta, values) => {

            if (values[value.id]) {
                delete values[value.id];
                return true;
            }

            return false;

        });

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
