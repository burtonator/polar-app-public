import {SnapshotSubscriber} from "./Snapshots";

export type SnapshotUnsubscriber = () => void;

export type OnUpdatedCallback = <D>(value: D | undefined) => void;

/**
 * Listen to data via a provider interface, and give us the ability to easily unsubscribe too.
 *
 * This provides us with both a live listener and a cached listener/getter.
 */
export interface DataListener<D> {

    get(): D | undefined;

    unsubscribe(): void;

}

export class DefaultDataListener<D> implements DataListener<D> {

    private value: D | undefined;
    private unsubscriber: SnapshotUnsubscriber;

    /**
     *
     * @param subscriber The subscriber to provide the data as well as an unsubscriber.
     * @param onUpdated An optional callback to also update us in real time.
     */
    constructor(private readonly subscriber: SnapshotSubscriber<D>,
                private readonly onUpdated?: OnUpdatedCallback) {

        const onNext = (data: D | undefined) => {
            this.value = data;

            if (this.onUpdated) {
                this.onUpdated(data);
            }
        };

        this.unsubscriber = subscriber(onNext);

    }

    public get(): D | undefined {
        return this.value;
    }

    public unsubscribe() {
        this.unsubscriber();
    }

}

/**
 * No data to provide the caller.
 */
export class NullDataListener<D> implements DataListener<D> {

    public get(): D | undefined {
        return undefined;
    }

    public unsubscribe(): void {
        // noop
    }

}

/**
 * A data listener with a static / configured value.
 */
export class StaticDefaultDataListener<D> implements DataListener<D> {

    public constructor(private readonly value: D | undefined) {
    }

    public get(): D | undefined {
        return this.value;
    }

    public unsubscribe(): void {
        // noop
    }

}

