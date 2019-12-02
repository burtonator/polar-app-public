import {ErrorHandlerCallback, SnapshotUnsubscriber} from "../../../../polar-bookshelf/web/js/firebase/Firebase";

export interface DataSubscriber {
    // tslint:disable-next-line:callable-types
    <D>(value: D | undefined, onError?: ErrorHandlerCallback): SnapshotUnsubscriber;
}

/**
 * Listen to data via a provider interface, and give us the ability to easily unsubscribe too.
 */
export class DataListener<D> {

    private value: D | undefined;
    private unsubscriber: SnapshotUnsubscriber;

    constructor(subscriber: DataSubscriber) {

        const onNext = (data: D | undefined) => {
            this.value = data;
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
