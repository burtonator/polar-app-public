type SyncMapper<T, V> = (value: T) => V;

type AsyncMapper<T, V> = (value: T) => Promise<V>;

type Mapper<T, V> = AsyncMapper<T, V> | SyncMapper<T, V>;



type SyncPredicate<T> = (value: T) => boolean;

type AsyncPredicate<T> = (value: T) => Promise<boolean>;

type Predicate<T> = AsyncPredicate<T> | SyncPredicate<T>;

export function asyncStream<T>(values: ReadonlyArray<T>) {
    return new AsyncArrayStream(async () => values);
}

type AsyncProvider<V> = () => Promise<ReadonlyArray<V>>;

export class AsyncArrayStream<T> {

    constructor(private provider: AsyncProvider<T>) {
    }

    public map<V>(mapper: Mapper<T, V>): AsyncArrayStream<V> {

        const provider: AsyncProvider<V> = async () => {

            const values = await this.provider();

            const mapped: V[] = [];

            for (const value of values) {
                const v = await mapper(value);
                mapped.push(v);
            }

            return mapped;

        };

        return new AsyncArrayStream<V>(provider);

    }

    public filter(predicate: Predicate<T>): AsyncArrayStream<T> {

        const provider: AsyncProvider<T> = async () => {

            const values = await this.provider();

            const result: T[] = [];

            for (const value of values) {
                if (await predicate(value)) {
                    result.push(value);
                }
            }

            return result;

        };

        return new AsyncArrayStream<T>(provider);

    }

    /**
     * Filter only values that are present (remove all null and undefined values)
     */
    public present(): AsyncArrayStream<NonNullable<T>> {

        const provider: AsyncProvider<NonNullable<T>> = async () => {

            const values = await this.provider();

            const result: NonNullable<T>[] = [];

            for (const value of values) {
                if (value !== null && value !== undefined) {
                    result.push(value!);
                }
            }

            return result;

        };

        return new AsyncArrayStream<NonNullable<T>>(provider);

    }

    public async collect(): Promise<ReadonlyArray<T>> {

        const values = await this.provider();

        return [...values];

    }

}
