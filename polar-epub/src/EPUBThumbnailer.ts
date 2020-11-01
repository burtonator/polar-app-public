import {ThumbnailerGenerateOpts} from "polar-shared/src/util/Thumbnailer";
import {EPUBDocs} from "./EPUBDocs";
import {Canvases} from "polar-shared/src/util/Canvases";
import {Images} from "polar-shared/src/util/Images";
import {Blobs} from "polar-shared/src/util/Blobs";

export namespace EPUBThumbnailer {

    export async function generate(opts: ThumbnailerGenerateOpts) {

        const book = await EPUBDocs.getDocument({url: opts.pathOrURL});

        const metadata = await book.loaded.metadata;
        const spine = await book.loaded.spine;

        const coverURL = await book.coverUrl();

        if (! coverURL) {
            return undefined;
        }

        console.log("FIXME: coverURL: ", coverURL);

        // FIXME: now I just have to pull compute the dimensions and then do the resize directly using
        // Canvases and then return the ImageData ..

        const dimensions = await Images.getDimensions(coverURL);

        const response = await fetch(coverURL);
        const blob = await response.blob();

        const acceptedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

        if (! acceptedTypes.includes(blob.type)) {
            throw new Error("Type not accepted: " + blob.type);
        }

        const data = Blobs.toArrayBuffer(blob);

        const imageData = Canvases.arrayBufferToImageData(data, dimensions, blob.type);

        return {
            ...imageData,
            scaledDimensions: dimensions,
            nativeDimensions: dimensions
        }

    }


}