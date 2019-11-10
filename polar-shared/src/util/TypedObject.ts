/**
 * A typed object has a type (which is a string) and a value so that we can serialize a record or store multiple
 * interface types but still know their types.  The type is usually a string type with a reserved enumeration of values
 * 'dog' or 'cat' for example rather than a completely free form string.
 */
export interface TypedObject<T extends string, V> {
    readonly type: T;
    readonly value: V;
}
