import PDFJS from "pdfjs-dist";

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
            return '../es5/build/pdf.worker.js';
        }

        // this should be in the browser so this should work.
        return '/node_modules/pdfjs-dist/build/pdf.worker.js';

    }
}
