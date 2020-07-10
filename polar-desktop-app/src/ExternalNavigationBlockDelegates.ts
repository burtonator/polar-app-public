import {remote} from "electron";
import {NullExternalNavigationBlock} from "./ExternalNavigationBlock";
import {DesktopRuntime} from "./DesktopRuntime";
import { ExternalNavigationBlockDelegate } from "./ExternalNavigationBlockDelegate";

declare var global: any;

export class ExternalNavigationBlockDelegates {

    public static get(): NullExternalNavigationBlock {

        if (DesktopRuntime.isElectron()) {

            const runtime = DesktopRuntime.get();

            if (runtime === 'electron-renderer') {
                return remote.getGlobal("externalNavigationBlock");
            } else if (runtime === 'electron-main') {
                return global.externalNavigationBlock;
            } else {
                return new NullExternalNavigationBlock();
            }

        } else {
            return new NullExternalNavigationBlock();
        }

    }
    public static init() {
        global.externalNavigationBlock = new ExternalNavigationBlockDelegate();
    }

}
