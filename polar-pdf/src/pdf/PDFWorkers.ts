import * as PDFJS from "pdfjs-dist";
import {Paths} from "polar-shared/src/util/Paths";

export namespace PDFWorkers {

    function isNode() {
        return typeof window === 'undefined';
    }

    export function computeWorkerSrcPath() {

        console.log("Running with pdf.js version: " + PDFJS.version);

        // https://github.com/mozilla/pdf.js/issues/11762
        //
        // The latest version of PDFJS splits legacy JS and modern and for node
        // we don't have ReadableStream so we have to use the ES5 version.

        if (isNode()) {
            // https://stackoverflow.com/questions/10111163/in-node-js-how-can-i-get-the-path-of-a-module-i-have-loaded-via-require-that-is

            const modulePath = require.resolve('pdfjs-dist');
            return Paths.join(modulePath, '../../legacy/build/pdf.worker.js');

        }

        // this should be in the browser so this should work.
        return '/pdfjs-dist/pdf.worker.js';

    }
}
