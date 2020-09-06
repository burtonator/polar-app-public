/**
 * A transaction that can be async and requires the UI to update before the
 * commit is executed.  The commit phase is async so that it can use (remote)
 * database resources.
 */
export interface IAsyncTransaction<T> {

    readonly prepare: () => void;
    readonly commit: () => Promise<T>;

}
