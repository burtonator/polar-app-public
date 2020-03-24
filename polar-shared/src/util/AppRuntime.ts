
declare var window: any;

/**
 * Used to determine if we're running in Electron or Chrome.
 */
export class AppRuntime {

    public static get(): AppRuntimeID {

        if (typeof window === 'undefined') {
            return 'node';
        }

        if (window?.process?.type) {
            return 'electron';
        } else {
            return 'browser';
        }

    }

}

export type AppRuntimeID = 'electron' | 'browser' | 'node';

