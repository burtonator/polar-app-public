import {ReleaseMetadataParser} from "./ReleaseMetadataParser";

const dir = process.argv[2];

async function exec() {
    const releaseMetadata = await ReleaseMetadataParser.parse(dir);
    const json = JSON.stringify(releaseMetadata, null, "  ");
    console.log(json);
}

exec().catch(err => console.error(err));
