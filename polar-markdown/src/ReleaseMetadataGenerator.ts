import {ReleaseMetadataParser} from "./ReleaseMetadataParser";

const dir = process.argv[2];

async function exec() {
    const releaseMetadata = await ReleaseMetadataParser.parse(dir);
    console.log(releaseMetadata);
}

exec().catch(err => console.error(err));
