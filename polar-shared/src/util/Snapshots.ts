import {NULL_FUNCTION} from "./Functions";
import {IDStr} from "./Strings";

/**
 * Callback for receiving errors
 */
export type OnErrorCallback = (err: Error) => void;

export type OnNextCallback<V> = (value: V | undefined) => void;

/**
 *
 * Function who's sole purpose to unsubscribe from snapshots.
 */
export type SnapshotUnsubscriber = () => void;

export type SnapshotSubscriberFactory<V> = () => SnapshotSubscriber<V>;

/**
 *
 * Allows us to subscribe to snapshots of a specific type and receive errors
 * and returns an unsubscribe function to unsubscribe from future exceptions.
 */
export type SnapshotSubscriber<V> = (onNext: OnNextCallback<V>, onError?: OnErrorCallback) => SnapshotUnsubscriber;

/**
 * Used to identify a SnapshotSubscriber to determine if we should unsubscribe
 * then resubscribe when the subscriber changes.
 */
export interface SnapshotSubscriberWithID<V> {

    /**
     * The ID of this subscriber so we can resubscribe.
     */
    readonly id: IDStr;

    /**
     * The subscribe function.
     */
    readonly subscribe: SnapshotSubscriber<V>;

}
export interface SubscriptionValue<T> {
    readonly value: T | undefined;
    readonly error: Error | undefined;
}

export type SnapshotTuple<T> = [T | undefined, Error | undefined];

/**
 * A null snapshot subscriber which can be used when you don't want to do
 * anything.
 */
export function NULL_SNAPSHOT_SUBSCRIBER<V>(onNext: OnNextCallback<V>, onError?: OnErrorCallback) {
    return NULL_FUNCTION;
}

export type SnapshotConverter<F, T> = (from: F | undefined) => T | undefined;

export namespace SnapshotSubscribers {

    /**
     * Convert a subscriber from and to the given value but behave like a normal
     * snapshot subscriber
     */
    export function converted<F, T>(subscriber: SnapshotSubscriber<F>,
                                    converter: SnapshotConverter<F, T>): SnapshotSubscriber<T> {

        return (onNext, onError) => {
            return subscriber(from => onNext(converter(from)), onError)
        };

    }

    /**
     * A snapshot that has a hard coded value that is a literal value 'of' the
     * given value.  The onNext function will fire once.
     */

    export function of<V>(value: V): SnapshotSubscriber<V> {

        return (onNext, onError) => {
            onNext(value);
            return NULL_FUNCTION;
        };

    }

}
