import {WebExtensions} from "./WebExtensions";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {isPresent} from "polar-shared/src/Preconditions";

export namespace PHZMigrationClient {

    export interface IStartPHZMigrationMessage {
        readonly type: 'start-phz-migration';
        readonly docID: string;
        readonly url: string;
    }

    interface ExecOpts {
        readonly docID: string;
        readonly url: string;
    }

    export async function exec(opts: ExecOpts): Promise<void> {
        await WebExtensions.Messaging.sendMessage({type: 'start-phz-migration', ...opts});
    }

}
