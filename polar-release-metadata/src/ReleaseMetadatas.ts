import {VersionStr} from "polar-shared/src/util/Version";
import {HTMLStr, URLStr} from "polar-shared/src/util/Strings";
import * as semver from 'semver';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {isPresent} from "polar-shared/src/Preconditions";

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

    /**
     * Return true if the specific release has metadata.
     */
    public static hasMetadata(release: VersionStr): boolean {
        const releases = IDMaps.create(this.get());
        return isPresent(releases[release]);
    }

}

export interface ReleaseMetadata {
    /**
     * The ID for this release metadata so we can lookup by ID / version.
     */
    readonly id: VersionStr;
    readonly title: string;
    readonly large_image: URLStr | undefined;
    readonly video_embed: URLStr | undefined;
    readonly release: VersionStr;
    readonly html: HTMLStr;
    readonly date: ISODateTimeString;
}

