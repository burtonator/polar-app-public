
declare var window: any;

/**
 * Used to determine if we're running in Electron or Chrome.
 */
export namespace AppRuntime {

    export function get(): AppRuntimeID {

        if (typeof window === 'undefined') {
            return 'node';
        }

        // FIXME: this won't work on our most recent polar-desktop-app build so
        // I need to figure this out. I think this only works if
        // node-integration is enabled
        if (window?.process?.type) {
            return 'electron';
        } else {
            return 'browser';
        }

    }

    export function isElectron() {
        return this.get() === 'electron'
    }

    export function isBrowser() {
        return this.get() === 'browser';
    }

    export function isNode() {
        return this.get() === 'node';
    }

}

export type AppRuntimeID = 'electron' | 'browser' | 'node';

