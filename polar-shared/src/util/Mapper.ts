/**
 * Simple class that functions like streams but only for mapping simple values
 * and transforming them without an intermediate variable.
 */
export class Mapper<T> {

    constructor(private readonly value: T) {
    }

    public map<R>(func: (value: T) => R) {
        return new Mapper(func(this.value));
    }

    public collect(): T {
        return this.value;
    }

}

export namespace Mappers {
    export function create<T>(value: T) {
        return new Mapper<T>(value);
    }
}
