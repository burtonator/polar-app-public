import {ExternalNavigationBlockDelegates} from "./ExternalNavigationBlockDelegates";

export namespace ExternalNavigationBlock {

    export function isExternal(url: string): boolean {

        const parsedURL = new URL(url);

        const host = parsedURL.hostname;

        if (['localhost', 'beta.getpolarized.io', 'app.getpolarized.io'].includes(host)) {
            // console.log("Always allowing localhost URL");
            return false;
        }

        return true;

    }

    export function set(enabled: boolean) {
        ExternalNavigationBlockDelegates.get().set(enabled);
    }

    export function get() {
        return ExternalNavigationBlockDelegates.get().get();
    }


}

export class NullExternalNavigationBlock {

    public set(enabled: boolean): void {
        // noop
    }

    public get() {
        return true;
    }

}

export interface IExternalNavigationBlock {

    set(enabled: boolean): void;

    get(): boolean;

}
