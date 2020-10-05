
const pkg: any = require("../../package.json");

export class Version {

    public static get(): VersionStr {

        if (typeof process !== 'undefined' && process.env && process.env.POLAR_VERSION) {
            // provide the version number from the environment so we can
            // override for testing.
            return process.env.POLAR_VERSION;
        }

        return pkg.version;

    }

    public static parsed(version: VersionStr = Version.get()): IVersion {

        const split = version.split(".");

        return {
            major: split[0],
            minor: split[1],
            sub: split[2]
        };

    }

    public static tokenized(version: VersionStr = Version.get()): IVersionTokens {
        const parsed = this.parsed(version);
        return {
            version_major: parsed.major,
            version_minor: parsed.major + '.' + parsed.minor,
            version,
        };
    }

}

export interface IVersion {
    readonly major: string;
    readonly minor: string;
    readonly sub: string;
}

export interface IVersionTokens {
    readonly version_major: string;
    readonly version_minor: string;
    readonly version: string;
}

export type VersionStr = string;
