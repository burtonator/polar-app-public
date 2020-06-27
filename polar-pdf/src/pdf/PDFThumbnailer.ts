import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {PageViewport, PDFPageProxy, Transform} from "pdfjs-dist";
import {PDFDocs} from "./PDFDocs";
import {Canvases} from "polar-shared/src/util/Canvases";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {Preconditions} from "polar-shared/src/Preconditions";
import {
    EventBus,
    PDFPageView,
    PDFPageViewOptions
} from "pdfjs-dist/web/pdf_viewer";

const CSS_UNITS = 96.0 / 72.0;

export namespace PDFThumbnailer {

    export type DataURLStr = string;

    function createCanvas(width: number, height: number) {

        Preconditions.assertCondition(width > 0, 'width <= 0');
        Preconditions.assertCondition(height > 0, 'height <= 0');

        const canvas = document.createElement('canvas');
        canvas.height = height;
        canvas.width = width;
        return canvas;
    }

    export async function generate2(pathOrURLStr: PathOrURLStr) {

        const task = PDFDocs.getDocument({url: pathOrURLStr});
        const doc = await task.promise;

        const page = await doc.getPage(1);

        // const container = document.createElement('div');
        // FIXME: ...
        const container = <HTMLDivElement> document.getElementById('root')!;
        const eventBus = new EventBus();
        const viewport = page.getViewport({scale: 1.0});

        const defaultViewport: PageViewport = viewport;

        // FIXME: using PDFPageView is the best option to generate PDFs with the
        // proper resolution. I could use page.render but it message up WRT
        // the correct resolution and PDFPageView has logic to handle it
        // directly.
        // FIXME: must call destroy afterwards...


        const opts: PDFPageViewOptions = {
            id: 1,
            container,
            eventBus,
            scale: 1.0,
            defaultViewport,
            textLayerMode: 0,
            renderInteractiveForms: false,
            renderer: 'canvas'
        }

        const view = new PDFPageView(opts);
        view.setPdfPage(page);

        await view.draw();

        const canvas = container.querySelector('canvas');

        if (! canvas) {
            throw new Error("No canvas");
        }

        const rect: ILTRect = {
            left: 0,
            top: 0,
            width: viewport.width,
            height: viewport.height
        }

        return await Canvases.extract(canvas, rect);

    }

    export async function generate(pathOrURLStr: PathOrURLStr) {

        // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly¡

        function scaleCanvasToPageViewport(page: PDFPageProxy, canvas: HTMLCanvasElement) {
            const vp = page.getViewport({scale: 1});
            return Math.min(canvas.width / vp.width, canvas.height / vp.height);
        }


        function showStatus(canvas: HTMLCanvasElement) {
            const target = document.getElementById('root');
            target!.appendChild(canvas);

            // if (thumbnail) {
            //
            // }

            // const img = document.createElement('img');
            // img.setAttribute('href', thumbnail);
            // target.appendChild(img);
        }

        async function makeThumb(page: PDFPageProxy) {


            // FIXME: this was working but I was getting an error that there
            // was 'no blob' ...

            // FIXME: the image is far too blurry...
            const viewport = page.getViewport({scale: 1.0});

            // FIXME: ... ok.. what I actually need to do is pick a width and a
            // height that I WANT the thumbnail to be, compute the viewport,
            // then render it to the canvas.

            const canvas = createCanvas(viewport.width, viewport.height);

            // https://github.com/mozilla/pdf.js/issues/5628
            //
            // In the html/css world 1in = 96pixels, in PDF the default is 1in =
            // 72pixels. The scale is used so when showing 100% a PDF that is
            // 8.5in should show up on the screen as 8.5in.

            // FIXME: what are CSS units???
            // const CSS_UNITS = 96.0 / 72.0;

            // FIXME: remove this
            // canvas.width = canvas.height = 96;

            const canvasContext = canvas.getContext("2d")!
            // const scale = scaleCanvasToPageViewport(page, canvas);

            const PRINT_RESOLUTION = 150;
            const PRINT_UNITS = PRINT_RESOLUTION / 72.0;

            const transform: Transform = [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0];

            await page.render({
                canvasContext,
                viewport: page.getViewport({scale: 1.0}),
                transform: [transform]
            }).promise;

            const rect: ILTRect = {
                left: 0,
                top: 0,
                width: viewport.width,
                height: viewport.height
            }
            showStatus(canvas);

            // FIXME: must call destroy afterwards...

            return await Canvases.extract(canvas, rect);

            // FIXME: this is wrong ... there's also a canvas screenshotter
            // in the screenshots for PDFs so maybe we just use that...
            // return dataURL;

        }

        const task = PDFDocs.getDocument({url: pathOrURLStr});
        const doc = await task.promise;

        const page = await doc.getPage(1);

        return await makeThumb(page);

    }



}
