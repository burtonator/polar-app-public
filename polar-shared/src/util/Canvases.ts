import {ILTRect} from './rects/ILTRect';
import {Preconditions} from '../Preconditions';
import {DataURL, DataURLs} from './DataURLs';
import {IDimensions} from "./IDimensions";
import {ImageType} from "./ImageType";


const DEFAULT_IMAGE_TYPE = 'image/png';
const DEFAULT_IMAGE_QUALITY = 1.0;

export type RawImageData = ArrayBuffer | DataURL | HTMLImageElement;

export interface ImageData {

    /**
     * The actual data of the image.
     */
    readonly data: ArrayBuffer | DataURL;

    /**
     * The internal format of the 'data'
     */
    readonly format: 'arraybuffer' | 'dataurl';

    readonly type: ImageType;

    readonly width: number;

    readonly height: number;

}

export namespace ImageDatas {

    export function toDataURL(image: ImageData): string {

        switch (image.format) {

            case "arraybuffer":
                return DataURLs.encode(<ArrayBuffer> image.data, image.type);
            case "dataurl":
                return <string> image.data;

        }

    }

}


/**
 * Functions for working with canvas objects, extracting screenshots, etc.
 */
export namespace Canvases {

    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/pdf-loader.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/extractor.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/debug-canvas.js

    /**
     * Take a canvas or an ArrayBuffer and convert it to a data URL without
     * limitations on the size of the URL.
     */
    export async function toDataURL(data: HTMLCanvasElement | ArrayBuffer,
                                   opts: ImageOpts = new DefaultImageOpts()): Promise<string> {

        // https://developer.mozilla.org/en-US/docs/Web/API/Blob

        const dataToArrayBuffer = async (): Promise<ArrayBuffer> => {

            if (data instanceof HTMLCanvasElement) {
                return await toArrayBuffer(data, opts);
            }

            return data;

        };

        const ab = await dataToArrayBuffer();

        return DataURLs.encode(ab, DEFAULT_IMAGE_TYPE);

    }

    export function toArrayBuffer(canvas: HTMLCanvasElement,
                                  opts: ImageOpts = new DefaultImageOpts()): Promise<ArrayBuffer> {

        // https://developer.mozilla.org/en-US/docs/Web/API/Blob
        //
        return new Promise((resolve, reject) => {

            canvas.toBlob((blob) => {

                if (blob) {

                    const reader = new FileReader();

                    reader.addEventListener("onloadstart", (err) => {
                        reject(err);
                    });

                    reader.addEventListener("loadend", () => {
                        const ab = <ArrayBuffer> reader.result;
                        resolve(ab);
                    });

                    reader.addEventListener("onerror", (err) => {
                        reject(err);
                    });

                    reader.addEventListener("onabort", (err) => {
                        reject(err);
                    });

                    reader.readAsArrayBuffer(blob);

                } else {
                    reject(new Error("No blob received from canvas."));
                }

            }, opts.type, opts.quality);

        });

    }

    async function createImageElementFromDataURL(image: DataURL): Promise<HTMLImageElement> {

        return new Promise<HTMLImageElement>((resolve, reject) => {

            const img = document.createElement("img") as HTMLImageElement;
            img.src = image;

            img.onload = () => resolve(img);

            img.onerror = (err) => reject(err);
            img.onabort = (err) => reject(err);

            return img;

        });
    }

    async function createImageElement(image: RawImageData): Promise<HTMLImageElement> {

        if (image instanceof HTMLImageElement) {
            // we're done...
            return image;
        }

        if (image instanceof ArrayBuffer) {
            const dataURL = await toDataURL(image);
            return createImageElementFromDataURL(dataURL);
        }

        return createImageElementFromDataURL(image);

    }

    export interface CropOpts extends ImageOpts, CanvasOpts {
    }

    function disableImageSmoothing(context: CanvasRenderingContext2D) {
        (<any> context).webkitImageSmoothingEnabled = false;
        (<any> context).mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
    }

    export async function crop(image: RawImageData,
                               rect: ILTRect,
                               opts: CropOpts = new DefaultImageOpts()): Promise<DataURL> {

        const src = await createImageElement(image);

        const canvas = opts.canvas || document.createElement("canvas");

        canvas.width  = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d', {alpha: false})!;

        disableImageSmoothing(ctx);

        ctx.drawImage(src,
                      rect.left, rect.top, rect.width, rect.height,
                      0, 0, rect.width, rect.height);

        return canvas.toDataURL();

    }

    export interface ResizeOpts extends ImageOpts, CanvasOpts {
    }

    export async function resize(data: RawImageData,
                                 dimensions: IDimensions,
                                 opts: ResizeOpts = new DefaultImageOpts()): Promise<ImageData> {

        // There are two main ways to accomplish image scaling.
        //
        // Both involve creating a 'src' element which is an HTMLImageElement
        // that contains our data.
        //
        // Then we have two options:
        //
        // 1.  Call drawImage but set the width/height of the target much smaller
        //     so that when it's drawn you have the right dimensions.
        //
        // 2.  Do something similar but then call scale() on the resulting image.
        //
        // This is essentially:
        //
        // <code>
        // ctx.drawImage(src, 0, 0, image.width, image.height,
        //               0, 0, image.width, image.height);
        //
        // const scaleX = dimensions.width / image.width;
        // const scaleY = dimensions.height / image.height;
        //
        // ctx.scale(scaleX, scaleY);
        // </code>
        //
        // ... but both strategies fail to work properly with clean smooth
        // re-render so the result looks horrible.

        const src = await createImageElement(data);

        const tmpCanvas = opts.canvas || document.createElement("canvas");

        const ctx = tmpCanvas.getContext('2d', {alpha: false})!;

        disableImageSmoothing(ctx);
        tmpCanvas.width = dimensions.width;
        tmpCanvas.height = dimensions.height;

        ctx.drawImage(src, 0, 0, src.width, src.height,
                      0, 0, dimensions.width, dimensions.height);

        return canvasToImageData(tmpCanvas, opts);

    }

    /**
     * Extract image data from the given canvas directly and return it as an
     * array buffer.
     * @param canvas The canvas we should extract with.
     * @param rect The rect within the given canvas
     * @param opts The options for the image extraction
     */
    export async function extract(canvas: HTMLCanvasElement,
                                  rect: ILTRect,
                                  opts: ImageOpts = new DefaultImageOpts()): Promise<ImageData> {

        Preconditions.assertPresent(canvas, "canvas");

        const xScale = canvas.width / canvas.offsetWidth;
        const yScale = canvas.height / canvas.offsetHeight;

        // scale the canvas rect to the actual width + height
        // of the internal canvas.
        const canvasRect = {
            left: rect.left * xScale,
            width: rect.width * xScale,
            top: rect.top * yScale,
            height: rect.height * yScale
        };

        const tmpCanvas = document.createElement("canvas");

        const tmpCanvasCtx = tmpCanvas.getContext('2d', {alpha: false})!;
        tmpCanvasCtx.imageSmoothingEnabled = false;

        tmpCanvas.width  = canvasRect.width;
        tmpCanvas.height = canvasRect.height;

        // copy data from the source canvas to the target
        tmpCanvasCtx.drawImage(canvas,
                               canvasRect.left, canvasRect.top, canvasRect.width, canvasRect.height,
                               0, 0, canvasRect.width, canvasRect.height);

        return await canvasToImageData(tmpCanvas, opts);


    }

    export async function canvasToImageData(canvas: HTMLCanvasElement,
                                            opts: ImageOpts = new DefaultImageOpts()): Promise<ImageData> {

        const data = await toArrayBuffer(canvas, opts);

        return arrayBufferToImageData(data, {width: canvas.width, height: canvas.height}, opts.type);

    }

    export async function arrayBufferToImageData(data: ArrayBuffer,
                                                 dimensions: IDimensions,
                                                 type: ImageType): Promise<ImageData> {

        return {
            data,
            format: 'arraybuffer',
            ...dimensions,
            type
        };

    }


}

export interface CanvasOpts {
    canvas?: HTMLCanvasElement;
}

export interface ImageOpts {
    readonly type: ImageType;
    readonly quality: number;
}

export class DefaultImageOpts implements ImageOpts {
    public readonly type = DEFAULT_IMAGE_TYPE;
    public readonly quality = DEFAULT_IMAGE_QUALITY;
}
