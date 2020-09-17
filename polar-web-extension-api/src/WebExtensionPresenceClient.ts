import {WebExtensions} from "./WebExtensions";
import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {isPresent} from "polar-shared/src/Preconditions";

export namespace WebExtensionPresenceClient {

    export interface IPresenceMessage {
        readonly type: 'presence';
        readonly version: string;
    }

    // https://stackoverflow.com/questions/6293498/check-whether-user-has-a-chrome-extension-installed

    export async function exec(): Promise<IPresenceMessage | undefined> {

        const response = await WebExtensions.Messaging.sendMessage({type: 'presence'});

        if (! isPresent(response)) {
            return undefined;
        }

        return response;

    }

    /**
     * Subscribe to presence notifications from the web extension.
     *
     * We provide either the presence message when installed or 'undefined' when
     * not installed.
     */
    export function subscribe(onNext: (presence: IPresenceMessage | undefined) => void): SnapshotUnsubscriber {

        function onMessage(message: any) {

            if (message === null || message === undefined) {
                onNext(undefined);
                return;
            }

            if (message.type === 'presence') {
                onNext(<IPresenceMessage> message);
            }

        }

        let unsubscriber: SnapshotUnsubscriber = NULL_FUNCTION;

        if (chrome && chrome.runtime && chrome.runtime.onMessage) {

            chrome.runtime.onMessage.addListener(onMessage);

            unsubscriber = () => {
                chrome.runtime.onMessage.removeListener(onMessage);
            };

        } else {
            console.warn("No addListener");
        }

        async function doAsync() {
            const response = await WebExtensions.Messaging.sendMessage({type: 'presence'})
            onMessage(response);
        }

        doAsync()
            .catch(err => console.error(err));

        return unsubscriber;

    }

}
