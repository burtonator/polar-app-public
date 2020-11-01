import {ThumbnailerGenerateOpts} from "polar-shared/src/util/Thumbnailer";
import {EPUBDocs} from "./EPUBDocs";

export namespace EPUBThumbnailer {

    export async function generate(opts: ThumbnailerGenerateOpts) {

        const book = await EPUBDocs.getDocument({url: opts.pathOrURL});

        const metadata = await book.loaded.metadata;
        const spine = await book.loaded.spine;

    }


}