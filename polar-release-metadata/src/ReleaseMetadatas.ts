import {VersionStr} from "polar-shared/src/util/Version";
import {HTMLStr} from "polar-shared/src/util/Strings";
import * as semver from 'semver';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

// just load the version on disk that's been pre-compiled.
const metadata = require("./release-metadata.json");

export class ReleaseMetadatas {

    /**
     * Get the release metadata, sorted by release version, descending.
     */
    public static get(): ReadonlyArray<ReleaseMetadata> {
        return this.sorted(metadata);
    }

    /**
     * Sort the release data by release version, descending.
     */
    public static sorted(releases: ReadonlyArray<ReleaseMetadata>): ReadonlyArray<ReleaseMetadata> {
        return [...releases]
            .sort((a, b) => semver.compare(a.release, b.release))
            .reverse();
    }

}

export interface ReleaseMetadata {
    readonly release: VersionStr;
    readonly html: HTMLStr;
    readonly date: ISODateTimeString;
}
