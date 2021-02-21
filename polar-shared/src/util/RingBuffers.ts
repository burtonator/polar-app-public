export namespace RingBuffers {

    /**
     * A delta over the interval [-∞, 0]
     */
    export type RingDelta = number;

    export interface IRingBuffer<T> {
        push: (value: T) => void;
        fetch: (delta: RingDelta) => T | undefined;
        prev: () => T | undefined;
        peek: () => T | undefined;
        size: () => number;
        length: () => number;
        toArray: () => ReadonlyArray<T>;
    }

    /**
     * Needed to hold the underlying value because an array lookup returns null
     * and we need the ability to STORE null.
     */
    interface Holder<T> {
        readonly value: T;
    }

    /**
     * RingBuffer that allows us to store a stream of entries but maintain a
     * fixed memory/size cap.
     */
    export function create<T>(maxLength: number): IRingBuffer<T> {

        let pointer = 0;
        const buffer: Holder<T>[] = [];
        let _size: number = 0;

        function push(value: T){
            pointer = (pointer + 1) % maxLength;
            buffer[pointer] = {value};
            _size = Math.min(_size + 1, maxLength)
        }

        function fetch(delta: RingDelta): T | undefined {

            const tmp = Math.abs((pointer - delta) % maxLength);

            const holder = buffer[tmp];

            if (holder !== undefined) {
                return holder.value;
            }

            return undefined;

        }

        function prev(): T | undefined {
            return fetch(-1);
        }

        function peek(): T | undefined {
            return fetch(0);
        }

        function size(): number {
            return _size;
        }

        function length(): number {
            return maxLength;
        }

        function toArray(): ReadonlyArray<T> {

            const result: T[] = [];

            for (let delta = (_size - 1) * -1; delta <= 0; ++delta) {
                result.push(fetch(delta)!);
            }

            return result;

        }

        return {push, fetch, prev, peek, size, length, toArray}

    }

}
