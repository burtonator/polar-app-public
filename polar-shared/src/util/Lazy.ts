
export type LazyProvider<T> = () => T;

export namespace Lazy {

    export function create<T>(factory: () => T): LazyProvider<T> {

        let value: T | undefined;

        return () => {

            if (value) {
                return value;
            }

            value = factory();

            return value;

        }

    }

}