//
// outDir: '/home/burton/projects/polar-bookshelf/dist',
//     arch: 1,
//     targets:
// [ SnapTarget {
//     name: 'snap',
//     isAsyncSupported: true,
//     packager: [LinuxPackager],
//     helper: [LinuxTargetHelper],
//     outDir: '/home/burton/projects/polar-bookshelf/dist',
//     options: [Object],
//     isUseTemplateApp: false } ],
//     packager:
// LinuxPackager {
//     info:
//         Packager {
//         cancellationToken: [CancellationToken],
//             _metadata: [Object],
//             _nodeModulesHandledExternally: false,
//             _isPrepackedAppAsar: false,
//             _devMetadata: [Object],
//             _configuration: [Object],
//             isTwoPackageJsonProjectLayoutUsed: false,
//             eventEmitter: [EventEmitter],
//             _appInfo: [AppInfo],
//             tempDirManager: [TmpDir],
//             _repositoryInfo: [Lazy],
//             afterPackHandlers: [Array],
//             debugLogger: [DebugLogger],
//             _productionDeps: null,
//             stageDirPathCustomizer: [Function],
//             _buildResourcesDir: '/home/burton/projects/polar-bookshelf/build',
//             _framework: [ElectronFramework],
//             projectDir: '/home/burton/projects/polar-bookshelf',
//             _appDir: '/home/burton/projects/polar-bookshelf',
//             options: [Object] },
//     platform:
//         Platform {
//         name: 'linux',
//             buildConfigurationKey: 'linux',
//             nodeName: 'linux' },
//     _resourceList: Lazy { _value: null, creator: [Function] },
//     platformSpecificBuildOptions:
//     { artifactName: '${name}-${version}-${arch}.${ext}',
//         synopsis: 'Polar Bookshelf',
//         description: 'Polar Bookshelf',
//         category: 'Office',
//         target: [Array],
//         fileAssociations: [Array] },
//     appInfo:
//         AppInfo {
//         info: [Packager],
//             platformSpecificOptions: [Object],
//             description: 'Polar Bookshelf',
//             version: '1.18.2',
//             buildNumber: undefined,
//             buildVersion: '1.18.2',
//             productName: 'Polar Bookshelf',
//             productFilename: 'Polar Bookshelf' },
//     executableName: 'polar-bookshelf' },
// electronPlatformName: 'linux' }

const fs = require('fs');
const {exec} = require('child_process');

exports.default = async function(context) {

    const requirePath = (path) => {
        if (!fs.existsSync(path)) {
            throw new Error("Path does does not exist: " + path);
        }
    };

    const isLinux =
        context.targets.find(target => ['appImage', 'deb', 'snap', 'tar.gz'].includes(target.name));

    console.log({isLinux});

    if (!isLinux) {
        console.log("Not linux so skipping --no-sandbox changes");
        return;
    }

    console.log("Configuring polar-desktop-app for --no-sandbox");

    const pathPolarDesktopApp = "dist/linux-unpacked/polar-desktop-app";
    const pathPolarDesktopAppBin = "dist/linux-unpacked/polar-desktop-app.bin";

    requirePath(pathPolarDesktopApp);
    requirePath("dist/linux-unpacked/chrome-sandbox");

    fs.renameSync(pathPolarDesktopApp, pathPolarDesktopAppBin);

    const wrapperScript = `#!/bin/bash
    SOURCE_FILE=$(readlink -f "\${BASH_SOURCE}")
    SOURCE_DIR=\${SOURCE_FILE%/*}
    "\${SOURCE_DIR}/polar-desktop-app.bin" "$@" --no-sandbox
  `;

    fs.writeFileSync(pathPolarDesktopApp, wrapperScript);
    exec(`chmod +x ${pathPolarDesktopApp}`);

    // electron builder doesn't seem to be properly setting the chrome-sandbox
    // permissions
    // console.log("Setting correct permissions and mode for chrome-sandbox");
    //
    // exec("chown root dist/linux-unpacked/chrome-sandbox");
    // exec("chmod 4755 dist/linux-unpacked/chrome-sandbox");

};
