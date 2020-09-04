import {WebExtensions} from "./WebExtensions";

export namespace WebExtensionPingClient {

    export interface IPingResponse {
        readonly version: string;
    }

    // https://stackoverflow.com/questions/6293498/check-whether-user-has-a-chrome-extension-installed
    export async function exec(): Promise<IPingResponse | undefined> {
        return await WebExtensions.Messaging.sendMessage({type: 'ping'});
    }

}
