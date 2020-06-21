#!/usr/bin/env node

// prod or beta
const POLAR_EXTENSION_TYPE = process.env.POLAR_EXTENSION_TYPE || 'PROD';

if (! ['PROD', 'BETA'].includes(POLAR_EXTENSION_TYPE)) {
    throw new Error("POLAR_EXTENSION_TYPE must be PROD or BETA")
}

const KEYS = {
    PROD: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz2a8p8uv41X3fndJZhoetT6PKYDqjPzZ7tffFrXmZCcImdGzukSe02iihAImsEkx3clfrj+ZBSfV5qScT9kpSSKBGUI7vVJJRNMQkcnfM7sBQHOS/ctQny5C8UM54OW0ZfBJysyjUbD0MiqUiLC8JZ2/UVIzL1Nq4JzW7eDQ2nBgYOoXUJ3i8IEYy9lvIw273nRyepFPlHtmaoqe6mRDLvnfUFkasEfJsIba+nCvkk/rRS+zcjIhdO/AKJEWSwDdkjh3CaHgHrWJEETbWa/m44xT5xgbZfbYTVGIPwWFvXnYlujQMPXd2W5FmbUoMSI3rSZ/CTQuE4zFaTOD3Mso6wIDAQAB",
    BETA: "TODO NEW KEY"
}

const fs = require('fs');

function readJSON(path) {
    const data = fs.readFileSync(path);
    return JSON.parse(data.toString('utf-8'));
}

function writeJSON(path, obj) {
    const data = JSON.stringify(obj, null, '  ');
    fs.writeFileSync(path, data);
}

function readPackageJSON() {
    return readJSON('./package.json');
}

function readManifestJSON() {
    return readJSON('./manifest.json');
}

function computeVersionMeta() {

    const pkg = readPackageJSON();

    const rawVersion = pkg.version;
    const version = rawVersion.replace('-beta', '');

    return {version, rawVersion};

}

function computeKey() {
    return KEYS[POLAR_EXTENSION_TYPE];
}

function computeNewManifest() {

    const versionMeta = computeVersionMeta();
    console.log("Using version: ", versionMeta);

    const manifest = readManifestJSON();

    // set the version metadata from the package.json
    manifest.version = versionMeta.version;

    const key = computeKey();

    manifest.key = key;

    if (POLAR_EXTENSION_TYPE === 'BETA') {
        manifest.name = manifest.name + " - BETA";
        manifest.description = manifest.description + " - THIS EXTENSION IS FOR BETA TESTING - Our production extension is located at https://chrome.google.com/webstore/detail/polar-pdf-web-and-documen/jkfdkjomocoaljglgddnmhcbolldcafd?hl=en"
    }

    writeJSON('dist/manifest.json', manifest);

}

computeNewManifest();
