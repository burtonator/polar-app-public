import {VersionStr} from "polar-shared/src/util/Version";
import {HTMLStr} from "polar-shared/src/util/Strings";

// just load the version on disk that's been pre-compiled.
const metadata = require("./release-metadata.json");

export class ReleaseMetadatas {

    public static get(): ReadonlyArray<ReleaseMetadata> {
        return metadata;
    }

}

export interface ReleaseMetadata {
    readonly release: VersionStr;
    readonly html: HTMLStr;
}
