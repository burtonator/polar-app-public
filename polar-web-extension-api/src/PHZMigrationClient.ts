import {WebExtensions} from "./WebExtensions";

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
