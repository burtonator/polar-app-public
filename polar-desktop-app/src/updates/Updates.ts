import {ipcMain} from 'electron';
import {autoUpdater, UpdateCheckResult, UpdateInfo} from 'electron-updater';
import {ProgressInfo} from "builder-util-runtime";
import {Logger} from 'polar-shared/src/logger/Logger';

import process from 'process';
import {Version} from 'polar-shared/src/util/Version';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import { AppUpdate } from './AppUpdate';
import {AppUpdates} from "./AppUpdates";

const ENABLE_AUTO_UPDATE = true;

const RANDOM_DELAY = TimeDurations.toRandom('3d');

const AUTO_UPDATE_DELAY_RECHECK = RANDOM_DELAY;

// borrowed from here and ported to typescript:
//
// https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js

const log = Logger.create();

// autoDownload has to be false because we look at the version number we're
// downloading to avoid downloading it multiple times.
autoUpdater.autoDownload = false;

// this is so that we can
autoUpdater.allowPrerelease = process.env.POLAR_AUTO_UPDATER_ALLOW_PRERELEASE === 'true';

log.info("Allowing pre-releases for auto-updates: " + autoUpdater.allowPrerelease);

export namespace Updates {

    let updateRequestedManually: boolean = false;

    let performingUpdate: boolean = false;

    /**
     * The current version that was updated to prevent duplicate updates.
     */
    let updatedVersion: string | undefined;

    let updater: Electron.MenuItem | null;

    // export this to MenuItem click callback
    export function checkForUpdates(menuItem: Electron.MenuItem) {

        if (performingUpdate) {
            return;
        }

        updater = menuItem;
        updater.enabled = false;

        checkForUpdatesManually();

    }

    export function checkForUpdatesManually() {

        if (performingUpdate) {
            return;
        }

        log.info("Checking for updates manually.");

        updateRequestedManually = true;

        doCheckForUpdates()
            .catch(err => log.error("Error handling updates: " + err ));

    }

    export function scheduleAutoUpdate(delay: number = AUTO_UPDATE_DELAY_RECHECK) {

        log.info("Scheduling auto update for N ms: " + delay);

        setTimeout(() => doAutoUpdate(), delay);

    }

    export function doAutoUpdate() {

        log.info("Checking for updates...");

        async function doAsync() {

            try {

                const updateResult = await doCheckForUpdates();
                log.info("Update result: ", updateResult);

            } finally {
                scheduleAutoUpdate();
            }

        }

        doAsync()
            .catch(err => log.error("Failed to check for updates: ", err))

    }

    export async function doCheckForUpdates(): Promise<UpdateCheckResult | undefined> {

        if (performingUpdate) {
            log.warn("Update already running. Skipping.");
            return undefined;
        }

        return await autoUpdater.checkForUpdates();

    }

    export function quitAndInstall() {
        autoUpdater.quitAndInstall();
    }

    export function start() {

        autoUpdater.on('checking-for-update', (info: UpdateInfo) => {
            performingUpdate = true;
        });

        autoUpdater.on('error', (error) => {

            console.log('update error:', error);

            // ToasterMessages.send({
            //      type: ToasterMessageType.ERROR,
            //      message: 'Error: ' + error == null ? "unknown" : (error.stack || error).toString()
            //  });

            updateRequestedManually = false;

            performingUpdate = false;

        });

        autoUpdater.on('update-cancelled', (info: UpdateInfo) => {
            log.info('update-cancelled');
            performingUpdate = false;
        });

        autoUpdater.on('update-available', (info: UpdateInfo) => {

            try {

                console.log("Update available: ", info);

                if (info && info.version) {

                    const fromVersion = Version.get();
                    const toVersion = info.version;

                    if (updatedVersion === toVersion) {
                        log.warn(`Already updated to version ${toVersion} (not re-downloading)`);
                        return;
                    }

                    updatedVersion = toVersion;

                    const appUpdate: AppUpdate = {
                        fromVersion,
                        toVersion,
                        automatic: ! updateRequestedManually
                    };

                    // Broadcasters.send("app-update:available", appUpdate);

                    // ToasterMessages.send({
                    //      type: ToasterMessageType.INFO,
                    //      message: `Downloading app update to version ${toVersion}`
                    //  });

                    console.log("Downloading update: " + toVersion, info);

                }

                autoUpdater.downloadUpdate()
                           .then(async () => {

                               log.info("Update downloaded.");

                           })
                           .catch(err => log.error("Error handling updates: " + err));



            } finally {
                updateRequestedManually = false;
            }

        });

        autoUpdater.on('update-not-available', () => {

            log.info('update-not-available');

            if (updateRequestedManually) {

                // ToasterMessages.send({
                //      type: ToasterMessageType.INFO,
                //      title: 'No update available',
                //      message: 'The current version of Polar is up-to-date',
                //      options: {
                //          requiresAcknowledgment: true,
                //          preventDuplicates: true
                //      }
                //  });

                if (updater) {
                    updater!.enabled = true;
                    updater = null;
                }

            }

            updateRequestedManually = false;

        });

        autoUpdater.on('update-downloaded', () => {

            log.info('update-downloaded');

            // ToasterMessages.send({
            //     type: ToasterMessageType.SUCCESS,
            //     title: 'Update downloaded',
            //     message: 'A new update for Polar was downloaded.  Please restart.',
            //     options: {
            //         requiresAcknowledgment: true,
            //         preventDuplicates: true
            //     }
            // });

            // Broadcasters.send("app-update:update-downloaded", {status: true} );

            updateRequestedManually = false;
            performingUpdate = false;

        });

        autoUpdater.on('download-progress', (progress: ProgressInfo) => {

            // ProgressBar

            // https://github.com/electron-userland/electron-builder/blob/docs/auto-update.md#event-download-progress
            // bytesPerSecond percent total transferred

            console.log(`Auto update download progress: ${progress.percent}. `, progress);

            // TODO: we're running in the main process here. We could use the IPC
            // broadcaster to send message to every renderer and have a controller
            // running there, listening for the messages on download progress updates
            // and then display the appropriate UI.

            // Broadcasters.send("app-update:download-progress", progress);
            //
            // Broadcasters.send("download-progress", progress);

        });

        ipcMain.on('app-update:check-for-update', () => {
            checkForUpdatesManually();
        });

        ipcMain.on('app-update:quit-and-install', () => {
            // autoUpdater.quitAndInstall();
        });

        if (ENABLE_AUTO_UPDATE && AppUpdates.platformSupportsUpdates()) {
            console.log("Auto updates enabled.");

            // add little bit of delay so that if an app update is available
            // that we don't need to interrupt the user as downloading the
            // new app would be slow and slow their usage of the app
            const initialDelay = 15 * 60 * 1000;

            Updates.scheduleAutoUpdate(initialDelay);
        } else {
            console.log("Auto updates disabled.");
        }

    }

}


