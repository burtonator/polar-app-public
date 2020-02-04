#!/usr/bin/env node

// find the directory in argv

// find the files

import {Files} from "polar-shared/src/util/Files";

function getScanDirs(): ReadonlyArray<string> {
    return process.argv.slice(2);
}

function execMocha(path: string) {
    //
}

function acceptTest(path: string) {

    if (path.endsWith("Test.js")) {
        return true;
    }

    return false;

}

async function exec() {

    const scanDirs = getScanDirs();

    for (const scanDir of scanDirs) {

        await Files.recursively(scanDir, async (path, stat) => {

            if (acceptTest(path)) {
                execMocha(path);
            }

        });

    }

}

exec()
    .catch(err => console.error(err));
