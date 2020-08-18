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

/**
 *
 * Allows us to subscribe to snapshots of a specific type and receive errors
 * and returns an unsubscribe function to unsubscribe from future exceptions.
 */
export type SnapshotSubscriber<V> = (onNext: OnNextCallback<V>, onError?: OnErrorCallback) => SnapshotUnsubscriber;
