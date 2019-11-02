import {Preconditions} from '../Preconditions';
import {Optional} from './ts/Optional';
import {IDStr} from "./Strings";

export class Dictionaries {

    /**
     * Convert a dictionary to number keys. In JS all dictionaries use string keys
     * but TS supports string keys.
     */
    public static numberKeys<T>(dict: {[key: number]: T}): ReadonlyArray<number> {
        return Object.keys(dict).map(current => parseInt(current));
    }

    public static values<T>(dict: {[key: string]: T} | undefined | null): T[] {

        const result: T[] = [];

        if (!dict) {
            // TODO: this can go away once we migrate to typescript everywhere
            return result;
        }

        return Object.values(dict);

    }

    public static entries<V>(dict: {[key: string]: V} | undefined | null): ReadonlyArray<DictionaryEntry<V>> {

        if (! dict) {
            return [];
        }

        return Object.entries(dict).map(current => {

            return {
                key: current[0],
                value: current[1]
            };

        });

    }

    /**
     * We iterate over all keys in the dictionary
     *
     * @param dict
     * @param callback
     */
    public static forDict<T>(dict: {[key: string]: T}, callback: ForDictCallbackFunction<T> ) {

        Preconditions.assertNotNull(dict, "dict");
        Preconditions.assertNotNull(callback, "callback");

        for (const key in dict) {

            if (dict.hasOwnProperty(key)) {
                const value = dict[key];
                callback(key, value);
            }

        }

    }

    /**
     * Returns a dictionary with sorted keys. Dictionaries by definition aren't
     * sorted by they're implemented internally as linked hash tables.  We
     * return the same canonical dictionaries (according to set theory) where
     * the key set are identical, just in a different key order.
     *
     * This is primarily used for testing purposes so that two dicts are always
     * canonically the same.
     *
     */
    public static sorted(dict: any): any {

        // TODO: this doesn't handle circular reference well and will chase its tail.

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (! (typeof dict === 'object')) {
            // if we're not a dictionary we're done
            return dict;
        }

        if (Array.isArray(dict)) {

            const result: any[] = [];

            for (let idx = 0; idx < dict.length; ++idx) {
                result[idx] = this.sorted(dict[idx]);
            }

            return result;

        } else {

            const result: any = {};

            const sortedKeys = Object.keys(dict).sort();

            for (const key of sortedKeys) {
                result[key] = this.sorted(dict[key]);
            }

            return result;

        }

    }

    public static deepCopy(dict: any): object {

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (! (typeof dict === 'object')) {
            // if we're not a dictionary we're done
            return dict;
        }

        if (Array.isArray(dict)) {

            const result: any[] = [];

            for (let idx = 0; idx < dict.length; ++idx) {
                result[idx] = this.deepCopy(dict[idx]);
            }

            return result;

        } else {

            const result: any = {};

            Object.keys(dict).forEach(key => {
                result[key] = this.deepCopy(dict[key]);
            });

            return result;

        }

    }


    /**
     *
     * Recursively work through this object and remove any fields that are
     * stored with undefined values.  This is primarily because Firebase doesn't
     * support undefined.
     *
     * // TODO: make this support generics properly.
     * @param dict
     */
    public static onlyDefinedProperties(dict: any): any {

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (! (typeof dict === 'object')) {
            // if we're not a dictionary we're done
            return dict;
        }

        const result: any = {};

        for (const key of Object.keys(dict).sort()) {
            const value = dict[key];

            if (value === undefined) {
                continue;
            }

            result[key] = this.onlyDefinedProperties(value);
        }

        return result;

    }


    /**
     * Create a deep copy of the given dictionary.
     *
     * @param dict
     */
    public static copyOf(dict: any): any {

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (typeof dict !== 'object') {
            // if we're not a dictionary we're just return the default dictionary.
            return dict;
        }

        const result: any = {};

        Object.keys(dict).forEach(key => {
            result[key] = this.copyOf(dict[key]);
        });

        return result;

    }

    /**
     * Easily convert an array to a dict.
     */
    public static toDict<V>(values: ReadonlyArray<V>, converter: (value: V) => string): {[key: string]: V} {

        const result: { [key: string]: V } = {};

        for (const value of values) {
            result[converter(value)] = value;
        }

        return result;

    }

    public static countOf<V>(dict: {[key: string]: V} | null | undefined) {

        return Optional.of(dict)
            .map(current => Object.keys(current).length)
            .getOrElse(0);

    }

    public static size<V>(dict: {[key: string]: V}) {
        return Object.keys(dict).length;
    }


    /**
     * If the specified key is not already associated with a value (or is mapped
     * to undefined or null), attempts to compute its value using the given
     * mapping function and enters it into this map unless undefined or null.
     *
     */
    public static computeIfAbsent<V>(dict: {[key: string]: V},
                                     key: string,
                                     mappingFunction: (newKey: string) => V): V {

        const currentValue = dict[key];

        if (currentValue) {
            return currentValue;
        } else {

            const newValue = mappingFunction(key);

            if (newValue) {
                dict[key] = newValue;
            }

            // note that we return the newValue EITHER way which could be null
            // or undefined here just like in a normal map.
            return newValue;

        }

    }

    public static putAll<V>(source: {[key: string]: V},
                            target: {[key: string]: V} = {}) {

        for (const key of Object.keys(source)) {
            target[key] = source[key];
        }

    }

    /**
     * Return true if the dictionary is empty and has no entries (null or
     * undefined too).
     */
    public static empty(dict: {[key: string]: any} | null | undefined): boolean {

        if (! dict) {
            return true;
        }

        return Object.values(dict).length === 0;

    }

    public static clear(dict: {[key: string]: any} | null | undefined) {

        if ( ! dict) {
            return;
        }

        for (const key of Object.keys(dict)) {
            delete dict[key];
        }

    }

}


type ForDictCallbackFunction<T> = (key: string, value: T) => void;

export interface DictionaryEntry<V> {
    readonly key: string;
    readonly value: V;
}

/**
 * Used as the type for Object literals using {}
 */
export interface Dict<T> {
    [index:string]: T;
}
