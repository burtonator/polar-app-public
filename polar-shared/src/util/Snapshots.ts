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

export type SnapshotSubscriber<V> = (onNext: OnNextCallback<V>, onError: ErrorCallback) => SnapshotUnsubscriber;
