import {PageViewport} from "pdfjs-dist";
import {PDFDocs} from "./PDFDocs";
import {Canvases} from "polar-shared/src/util/Canvases";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {
    EventBus,
    PDFPageView,
    PDFPageViewOptions
} from "pdfjs-dist/web/pdf_viewer";
import {IThumbnail, ThumbnailerGenerateOpts, Thumbnailers} from "polar-shared/src/util/Thumbnailer";

export namespace PDFThumbnailer {

    export type DataURLStr = string;

    export async function generate(opts: ThumbnailerGenerateOpts): Promise<IThumbnail> {

        // The best strategy here is going to be to allow the thumbnail to be
        // LARGER than we expect but then we need to shrink it smaller via CSS.
        //
        // There are 3 resolution systems so the trick is to get to the target
        // image resolution and visibility without the image being fuzzy.

        // - PDFs render at 72 DPI and the web renders at 96dpi
        //
        // - The resulting image has to be downscaled as PDF.js renders the
        // canvas slightly larger than the image and then scales it back so that
        // it doesn't look fuzzy.
        //
        // - I tried to resize time image directly but when I do the PDF in
        // canvas it looks horrible asPDF.js is getting away with this because
        // CSS does resize elegantly.

        // - pdf.js always renders at 72 DPI in the canvas and then CSS scaling
        // it down to 25% to increase the image size to 96 DPI

        // PPI setup here is really confusing because there are various scales
        // that have to be adjusted.
        //
        // - PDFs have their own resolution
        // - ... then CSS has its own px resolution scaling.
        // - ... then Canvas has its own high DPI scaling.

        const {pathOrURL} = opts;

        const task = PDFDocs.getDocument({url: pathOrURL});
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

        // Using PDFPageView is the best option to generate PDFs with the proper
        // resolution. I could use page.render but it message up WRT the correct
        // resolution and PDFPageView has logic to handle it directly.

        // https://github.com/mozilla/pdf.js/issues/10745
        // https://stackoverflow.com/questions/13038146/pdf-js-scale-pdf-on-fixed-width
        // https://github.com/mozilla/pdf.js/issues/9973
        // https://github.com/mozilla/pdf.js/issues/5628

        const scaledDimensions = Thumbnailers.computeScaleDimensions(opts, viewport);

        const pageViewOptions: PDFPageViewOptions = {
            id: 1,
            container,
            eventBus,
            scale: scaledDimensions.scale,
            defaultViewport,
            textLayerMode: 0,
            renderInteractiveForms: false,
            renderer: 'canvas'
        }

        const view = new PDFPageView(pageViewOptions);
        view.setPdfPage(page);

        await view.draw();

        const canvas = container.querySelector('canvas');

        if (! canvas) {
            throw new Error("No canvas");
        }

        const rect: ILTRect = {
            left: 0,
            top: 0,
            width: view.width,
            height: view.height
        };

        try {

            const imageData = await Canvases.extract(canvas, rect);

            return {
                ...imageData,
                width: scaledDimensions.width,
                height: scaledDimensions.height,
                scaledDimensions,
                nativeDimensions: {
                    width: imageData.width,
                    height: imageData.height
                }
            };

        } finally {
            view.destroy();
        }

    }

}
