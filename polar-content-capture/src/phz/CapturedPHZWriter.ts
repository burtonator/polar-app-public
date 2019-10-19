import {forOwnKeys} from 'polar-shared/src/util/Functions';
import {ResourceFactory} from './ResourceFactory';
import {Captured, CapturedDoc} from '../capture/Captured';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Objects} from "polar-shared/src/util/Objects";
import {PHZWriter} from "./PHZWriter";
import {PathStr} from "polar-shared/src/util/Strings";
import {PHZWritable} from "./PHZWritable";

/**
 * Writes out a PHZ archive from the given captured JSON data.
 */
export class CapturedPHZWriter {

    constructor(public readonly output: PathStr | PHZWritable) {
    }

    /**
     * Convert it to the PHZ file at the given path.
     *
     * @param captured
     * @return {Promise<void>}
     */
    public async convert(captured: Captured) {

        const toPHZWritable = () => {

            if (typeof this.output === 'string') {
                return new PHZWriter(this.output);
            }

            return <PHZWritable> this.output;

        };

        const phzWriter = toPHZWritable();

        // convert the captured to metadata...
        const metadata = CapturedPHZWriter.toMetadata(captured);

        // now work with each resource

        await forOwnKeys(captured.capturedDocuments, async (url: string, capturedDocument: CapturedDoc) => {

            const contentType =
                Optional.of(capturedDocument.contentType)
                    .getOrElse("text/html");

            const resource = ResourceFactory.create(capturedDocument.url, contentType);
            resource.title = capturedDocument.title;
            resource.docTypeFormat = capturedDocument.docTypeFormat;

            await phzWriter.writeResource(resource, capturedDocument.content, capturedDocument.url);

        });

        await phzWriter.writeMetadata(metadata);
        await phzWriter.close();

    }

    public static toMetadata(captured: any) {
        const metadata = Objects.duplicate(captured);
        delete metadata.content;
        delete metadata.capturedDocuments;
        return metadata;
    }

}
