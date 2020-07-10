import {ExternalNavigationBlockDelegates} from "./ExternalNavigationBlockDelegates";

export class ExternalNavigationBlock {

    public static set(enabled: boolean) {
        ExternalNavigationBlockDelegates.get().set(enabled);
    }

    public static get() {
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
