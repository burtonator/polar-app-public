import {ThumbnailerGenerateOpts, Thumbnailers} from "polar-shared/src/util/Thumbnailer";
import {EPUBDocs} from "./EPUBDocs";
import {Canvases} from "polar-shared/src/util/Canvases";
import {Images} from "polar-shared/src/util/Images";
import {Blobs} from "polar-shared/src/util/Blobs";

export namespace EPUBThumbnailer {

    export async function generate(opts: ThumbnailerGenerateOpts) {

        const book = await EPUBDocs.getDocument({url: opts.pathOrURL});

        const coverURL = await book.coverUrl();

        if (! coverURL) {
            return undefined;
        }

        const nativeDimensions = await Images.getDimensions(coverURL);

        const response = await fetch(coverURL);
        const blob = await response.blob();

        const acceptedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

        if (! acceptedTypes.includes(blob.type)) {
            throw new Error("Type not accepted: " + blob.type);
        }

        const data = await Blobs.toArrayBuffer(blob);

        const scaledDimensions = Thumbnailers.computeScaleDimensions(opts, nativeDimensions);

        const imageData = await Canvases.arrayBufferToImageData(data, nativeDimensions, blob.type);

        try {
            const scaledImageData = await Canvases.resize(imageData.data, scaledDimensions)

            return {
                ...scaledImageData,
                scaledDimensions,
                nativeDimensions
            }
        } catch (e) {
            console.error(e);
            throw e;
        }

    }

}