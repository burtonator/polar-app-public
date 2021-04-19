import {Preconditions} from '../Preconditions';
import {Optional} from './ts/Optional';

export namespace Dictionaries {

    /**
     * Return JUST the data attributes (data-*) in a dictionary.
     */
    export function dataAttributes(dict: Readonly<{[key: string]: any}>): Readonly<{[key: string]: string}> {

        function predicate(key: string, value: any) {
            return key.startsWith('data-') && typeof value === 'string';
        }

        return filter(dict, predicate);

    }

    export function filter<T>(dict: Readonly<{[key: string]: T}>, predicate: (key: string, value: T) => boolean): Readonly<{[key: string]: T}> {

        const result: {[key: string]: T} = {};

        for (const key of Object.keys(dict)) {
            const value = dict[key];
            if (predicate(key, value)) {
                result[key] = value;
            }
        }

        return result;

    }

    /**
     * Return true if a is equal to be but using only the given keys.
     */
    export function equals(a: any, b: any, keys: ReadonlyArray<string>) {

        for(const key of keys) {
            if (a[key] !== b[key]) {
                return false;
            }
        }

        return true;

    }

    /**
     * Convert a dictionary to number keys. In JS all dictionaries use string keys
     * but TS supports string keys.
     */
    export function numberKeys<T>(dict: {[key: number]: T}): ReadonlyArray<number> {
        return Object.keys(dict).map(current => parseInt(current));
    }

    export function values<T>(dict: {[key: string]: T} | undefined | null): T[] {

        const result: T[] = [];

        if (!dict) {
            // TODO: this can go away once we migrate to typescript everywhere
            return result;
        }

        return Object.values(dict);

    }

    export function entries<V>(dict: {[key: string]: V} | undefined | null): ReadonlyArray<DictionaryEntry<V>> {

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
    export function forDict<T>(dict: {[key: string]: T}, callback: ForDictCallbackFunction<T> ) {

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
    export function sorted(dict: any): any {

        // TODO: this doesn't handle circular reference well and will chase its tail.

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (typeof dict !== 'object') {
            // if we're not a dictionary we're done
            return dict;
        }

        if (Array.isArray(dict)) {

            const result: any[] = [];

            for (let idx = 0; idx < dict.length; ++idx) {
                result[idx] = sorted(dict[idx]);
            }

            return result;

        } else {

            const result: any = {};

            const sortedKeys = Object.keys(dict).sort();

            for (const key of sortedKeys) {
                result[key] = sorted(dict[key]);
            }

            return result;

        }

    }

    export function deepCopy<T>(dict: T): T {

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (typeof dict !== 'object') {
            // if we're not a dictionary we're done
            return dict;
        }

        if (Array.isArray(dict)) {
            return dict.map(current => deepCopy(current)) as any;
        } else {

            const result: any = {};

            for(const key of Object.keys(dict)) {
                result[key] = deepCopy((dict as any)[key]);
            }

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
    export function onlyDefinedProperties(dict: any): any {

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (typeof dict !== 'object') {
            // if we're not a dictionary we're done
            return dict;
        }

        const result: any = {};

        if (Array.isArray(dict)) {
            return dict.map(current => onlyDefinedProperties(current));
        } else {

            for (const key of Object.keys(dict).sort()) {
                const value = dict[key];

                if (value === undefined) {
                    continue;
                }

                result[key] = onlyDefinedProperties(value);
            }

            return result;

        }

    }

    /**
     * Create a deep copy of the given dictionary.
     *
     * @param dict
     * @Deprecated use deepCopy which can handle arrays.
     */
    export function copyOf(dict: any): any {

        if (dict === undefined || dict === null) {
            // nothing to do here.
            return dict;
        }

        if (typeof dict !== 'object') {
            // if we're not a dictionary we're just return the current value.
            return dict;
        }

        const result: any = {};

        Object.keys(dict).forEach(key => {
            result[key] = copyOf(dict[key]);
        });

        return result;

    }

    /**
     * Easily convert an array to a dict.
     */
    export function toDict<V>(values: ReadonlyArray<V>, converter: (value: V) => string): {[key: string]: V} {

        const result: { [key: string]: V } = {};

        for (const value of values) {
            result[converter(value)] = value;
        }

        return result;

    }

    export function countOf<V>(dict: {[key: string]: V} | null | undefined) {

        return Optional.of(dict)
            .map(current => Object.keys(current).length)
            .getOrElse(0);

    }

    export function size<V>(dict: {[key: string]: V}) {
        return Object.keys(dict).length;
    }


    /**
     * If the specified key is not already associated with a value (or is mapped
     * to undefined or null), attempts to compute its value using the given
     * mapping function and enters it into this map unless undefined or null.
     *
     */
    export function computeIfAbsent<V>(dict: {[key: string]: V},
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

    export function putAll<V>(source: {[key: string]: V},
                              target: {[key: string]: V} = {}) {

        for (const key of Object.keys(source)) {
            target[key] = source[key];
        }

    }

    function copyKeys<T>(src: T, dest: T, keys: ReadonlyArray<keyof T>) {
        for (const key of keys) {
            dest[key] = src[key];
        }
    }

    /**
     * Return true if the dictionary is empty and has no entries (null or
     * undefined too).
     */
    export function empty(dict: {[key: string]: any} | null | undefined): boolean {

        if (! dict) {
            return true;
        }

        return Object.values(dict).length === 0;

    }

    export function clear(dict: {[key: string]: any} | null | undefined) {

        if ( ! dict) {
            return;
        }

        for (const key of Object.keys(dict)) {
            delete dict[key];
        }

    }

    /**
     * Pretty printed and sorted JSON
     */
    export function toJSON(obj: any) {
        return JSON.stringify(sorted(obj), null, "  ")
    }

}


interface ForDictCallbackFunction<T> {
    (key: string, value: T): void;
}

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
