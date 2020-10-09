
declare var window: any;

/**
 * Used to determine if we're running in Electron or Chrome.
 */
export namespace AppRuntime {

    export function get(): AppRuntimeID {

        if (typeof window === 'undefined') {
            return 'node';
        }

        if (window?.process?.type) {
            return 'electron';
        }

        if (navigator.userAgent.indexOf('polar-desktop-app') !== -1) {
            // our most recent desktop app sets the UA to include
            // polar-desktop-app and this is the only way to know for certain as
            // we're trying to get the Electron build to be just a simple browser
            // app like the mobile apps.
            return 'electron';
        }

        return 'browser';

    }

    export function isElectron() {
        return get() === 'electron'
    }

    export function isBrowser() {
        return get() === 'browser';
    }

    export function isNode() {
        return get() === 'node';
    }

}

export type AppRuntimeID = 'electron' | 'browser' | 'node';

