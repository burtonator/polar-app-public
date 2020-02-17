import {ReleaseMetadataParser} from "./ReleaseMetadataParser";
import {ReleaseMetadata} from "./ReleaseMetadatas";
import {Arrays} from "polar-shared/src/util/Arrays";

const dir = process.argv[2];

function validateMetadata(json: string) {

    const releaseMetadata: ReadonlyArray<ReleaseMetadata> = JSON.parse(json);

    const groups = Arrays.groupBy(releaseMetadata, value => value.id);

    for (const key of Object.keys(groups)) {
        const group = groups[key];
        if (group.length > 1) {
            throw new Error("Too many values in group for key: " + key);
        }
    }

}

async function exec() {
    const releaseMetadata = await ReleaseMetadataParser.parse(dir);
    const json = JSON.stringify(releaseMetadata, null, "  ");
    validateMetadata(json);
    console.log(json);
}

exec().catch(err => console.error(err));
