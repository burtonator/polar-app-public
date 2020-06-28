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

        // FIXME: this is actually a difficult problme... primarily because
        // there are 3 resolution systems so the trick is to get to the target
        // image resolution and visibility without the image being fuzzy.

        // - PDFs render at 72 DPI and the web renders at 96dpi
        //
        // - The resulting image may have to be downscaled as PDF.js renders
        //   the canvas slightly larger than the image and then scales it back
        //   so that it doesn't look fuzzy.
        //
        // - I tried to resize but when I do the PDF in canvas it looks horrible
        //   and I think PDF.js is getting away with this because CSS does
        //   resize elegantly.

        // - I think what's happening is that they are always rendering at 72 DPI
        //   in the canvas and then CSS scaling it down to 25% to increase the
        //   image size to 96 DPI
        //
        // - but this doesn't make much sense as our version is 62% of the
        //   original...s

        // PPI setup here is really confusing because there are various scales
        // that have to be adjusted.
        //
        // - PDFs have their own resolution
        // - ... then CSS has its own px resolution scaling.
        // - ... then Canvas has its own high DPI scaling.

        const task = PDFDocs.getDocument({url: pathOrURLStr});
        const doc = await task.promise;

        const page = await doc.getPage(1);

        function createContainer() {

            const container = document.createElement('div');

            // this tricks the DOM to now show the div.
            container.setAttribute('style', 'height: 0%; overflow: hidden');

            // unfortunately, the container must be part of the DOM or it
            // won't render but if it's hidden it should be fine.

            document.body.appendChild(container);

            return container;

        }

        const container = createContainer();

        const eventBus = new EventBus();
        const viewport = page.getViewport({scale: 1.0});

        const defaultViewport: PageViewport = viewport;

        // Using PDFPageView is the best option to generate PDFs with the
        // proper resolution. I could use page.render but it message up WRT
        // the correct resolution and PDFPageView has logic to handle it
        // directly.

        // https://github.com/mozilla/pdf.js/issues/10745
        // https://stackoverflow.com/questions/13038146/pdf-js-scale-pdf-on-fixed-width
        // https://github.com/mozilla/pdf.js/issues/9973
        // https://github.com/mozilla/pdf.js/issues/5628


        const opts: PDFPageViewOptions = {
            id: 1,
            container,
            eventBus,
            scale: 0.25,
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

        console.log(`FIXME view.scale: ${view.scale}`);
        console.log(`FIXME view height: ${view.height} , width: ${view.width}`);
        console.log(`FIXME viewport height: ${viewport.height} , width: ${viewport.width}`);
        console.log(`FIXME canvas height: ${canvas.height} , width: ${canvas.width}`);

        // 816, height: 1056 = 1.294
        // 8.5 x 11 = 1.294

        // 1689 1305 = 1.294 (but it's truncated.. .why?)

        // FIXME but the canvas height seems wrong.

        // FIXME view.width is right.. not the height though...
        const rect: ILTRect = {
            left: 0,
            top: 0,
            width: view.width,
            height: view.height
        }

        console.log("FIXME: rendering with rect: ", rect);

        // FIXME: NOW the challenge is that the canvas is larger than the image
        // size on screen so how do I adjust it properly... ?

        try {

            const rawImage = await Canvases.extract(canvas, rect);

            const resizeDimensions = {
                width: view.width,
                height: view.height
            };

            console.log("FIXME: resizing to: ", resizeDimensions);

            return await Canvases.resize(rawImage, resizeDimensions);

        } finally {
            // FIXME: view.destroy();
        }

    }

    // 204 / 264
    // 327 / 423

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
