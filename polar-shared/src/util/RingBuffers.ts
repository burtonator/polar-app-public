export namespace RingBuffers {

    export interface IRingBuffer<T> {
        push: (value: T) => void;
        prev: () => T | undefined;
        peek: () => T | undefined;
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

        function push(value: T){
            pointer = (pointer + 1) % maxLength;
            buffer[pointer] = {value};
        }

        function prev(): T | undefined {

            const tmp = Math.abs((pointer - 1) % maxLength);

            const holder = buffer[tmp];

            if (holder !== undefined) {
                return holder.value;
            }

            return undefined;

        }

        function peek(): T | undefined {

            const holder = buffer[pointer];
            if (holder !== undefined) {
                return holder.value;
            }

            return undefined;

        }

        return {push, prev, peek}

    }

}
