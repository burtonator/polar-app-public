import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export interface IExternalNavigationBlock {

    set(enabled: boolean): void;

    get(): boolean;

}

export class ExternalNavigationBlockDelegate {

    private enabled: boolean = true;

    public set(enabled: boolean) {
        log.notice("External navigation block enabled: " + enabled);
        this.enabled = enabled;
    }

    public get() {
        return this.enabled;
    }

}
