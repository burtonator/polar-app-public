import {ipcMain, ipcRenderer} from 'electron';

/**
 * Used to determine if we're running in Electron or Chrome.
 */
export namespace DesktopRuntime {

    export function get(): DesktopRuntimeName {

        if (ipcRenderer) {
            return 'electron-renderer';
        } else if (ipcMain) {
            return 'electron-main';
        } else {
            return 'browser';
        }

    }

    /**
     * A higher level runtime type (electron or browser)
     */
    export function type(): DesktopRuntimeType {

        switch (get()) {

            case 'electron-renderer':
                return 'electron';

            case 'electron-main':
                return 'electron';

            case 'browser':
                return 'browser';

        }

    }

    export function isElectron() {
        return get().startsWith('electron-');
    }

    export function isBrowser() {
        return get() === 'browser';
    }

}

export type DesktopRuntimeName = 'electron-renderer' | 'electron-main' | 'browser';

export type DesktopRuntimeType = 'electron' | 'browser';

