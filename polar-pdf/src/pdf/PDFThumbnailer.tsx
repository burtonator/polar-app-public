import {PathOrURLStr} from "polar-shared/src/util/Strings";
import { PDFPageProxy } from "pdfjs-dist";
import {PDFDocs} from "./PDFDocs";
import {Canvases} from "polar-shared/src/util/Canvases";

export namespace PDFThumbnailer {

    export async function generate(pathOrURLStr: PathOrURLStr) {

        function createCanvas(width: number, height: number) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = height;
            canvas.width = width;
            return canvas;
        }

        function scaleCanvasToPageViewport(page: PDFPageProxy, canvas: HTMLCanvasElement) {
            const vp = page.getViewport({scale: 1});
            return Math.min(canvas.width / vp.width, canvas.height / vp.height);
        }

        async function makeThumb(page: PDFPageProxy) {

            // const canvas = document.createElement("canvas");
            const canvas = createCanvas(1024, 768);
            canvas.width = canvas.height = 96;

            const canvasContext = canvas.getContext("2d")!
            const scale = scaleCanvasToPageViewport(page, canvas);

            await page.render({
                canvasContext,
                viewport: page.getViewport({scale})
            }).promise;

            const dataURL = await Canvases.toDataURL(canvas);

            // FIXME: this is wrong ... there's also a canvas screenshotter
            // in the screenshots for PDFs so maybe we just use that...
            return dataURL;

        }

        const task = PDFDocs.getDocument({url: pathOrURLStr});
        const doc = await task.promise;

        const page = await doc.getPage(1);

        await makeThumb(page);

    }



}
