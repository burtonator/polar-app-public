import {ThumbnailerGenerateOpts} from "polar-shared/src/util/Thumbnailer";
import {EPUBDocs} from "./EPUBDocs";

export namespace EPUBThumbnailer {

    export async function generate(opts: ThumbnailerGenerateOpts) {

        const book = await EPUBDocs.getDocument({url: opts.pathOrURL});

        const metadata = await book.loaded.metadata;
        const spine = await book.loaded.spine;

        const coverURL = await book.coverUrl()

        if (! coverURL) {
            return undefined;
        }

        console.log("FIXME: coverURL: ", coverURL);

        const response = await fetch(coverURL);

        const blob = await response.blob();

        console.log("FIXME: headers: ", response.headers);
        console.log("FIXME: blob type: ", blob.type);

        return undefined;

    }


}