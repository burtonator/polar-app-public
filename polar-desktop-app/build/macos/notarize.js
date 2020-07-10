require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== 'darwin') {
        return;
    }

    console.log("Waiting for MacOS build notarization...");

    function requireENV(key) {

        if (! process.env[key]) {
            throw new Error("No env " + key);
        }

    }

    requireENV('APPLEID');
    requireENV('APPLEIDPASS');

    const appName = context.packager.appInfo.productFilename;

    // this is going to either be
    // io-getpolarized-app
    // io.getpolarized.app
    // io.getpolarized.*
    // io.getpolarized.*
    // Polar
    return await notarize({
        appBundleId: 'io.getpolarized.app',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
    });
};
