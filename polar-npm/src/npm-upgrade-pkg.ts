#!/usr/bin/env node

// upgrade the current npm package but only if the version number does not equal
// what we're given AND the package has the current version.
//
// this way, via lerna, we can require all packages have the same version
//
// without a version argument, we just return the currently installed version.

import fs from 'fs';

function die(msg: string) {
    console.error(msg);
    process.exit(1);
}

function readPackageData() {

    const data = fs.readFileSync('./package.json');
    return JSON.parse(data.toString('utf-8'));

}

interface Args {
    readonly pkg: string;
    readonly version?: string;
}

function parseArgs(): Args {
    const pkg = process.argv[2];
    const version = process.argv[3] || undefined;

    if (! pkg) {
        throw new Error("No version given: ");
    }

    return {pkg, version};
}

type DependencyType = 'dev' | 'normal';

interface PackageDependency {
    readonly type: DependencyType;
    readonly dependencies: any;
    readonly version: string;
}

function computePackageDependency(packageData: any, name: string): PackageDependency | undefined {

    const compute = (dependencies: any, type: DependencyType): PackageDependency | undefined => {

        if (! dependencies) {
            return undefined;
        }

        const version = dependencies[name] || undefined;

        if (version) {

            return {
                type,
                dependencies,
                version
            };

        }

        return undefined;

    };

    return compute(packageData.dependencies, 'normal') || compute(packageData.devDependencies, 'dev');

}

function writePackageData(packageData: any) {
    fs.writeFileSync("./package.json", JSON.stringify(packageData, null, '  '));
}

function exec() {

    if (! fs.existsSync('./package.json')) {
        die("package.json does not exist");
    }

    const args = parseArgs();

    const packageData = readPackageData();

    const packageDependency = computePackageDependency(packageData, args.pkg);

    console.log(`Found package dependency for ${args.pkg}: ${packageDependency?.version}`);

    if (packageDependency) {

        if (args.version) {

            if (args.version !== packageDependency.version) {
                packageDependency.dependencies[args.pkg] = args.version;
                writePackageData(packageData);
                console.log(`Package successfully upgraded to ${args.version} (${packageDependency.type})`);
            } else {
                console.warn(`Not writing upgraded package: (versions identical)`);
            }

        } else {
            console.warn("Not writing upgraded package: (no version given)");
        }

    } else {
        console.warn("Not writing upgraded package: (no package dependency)");
    }

}

exec();
