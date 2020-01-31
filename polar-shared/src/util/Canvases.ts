import {ArrayBuffers} from './ArrayBuffers';
import {ILTRect} from './rects/ILTRect';
import {Preconditions} from '../Preconditions';
import {DataURL} from './DataURLs';
import {IDimensions} from "./IDimensions";

const DEFAULT_IMAGE_TYPE = 'image/png';
const DEFAULT_IMAGE_QUALITY = 1.0;

/**
 * Keeps the binary data but also metadata for the extract.
 */
export interface ExtractedImage {
    readonly data: ArrayBuffer | DataURL;
    readonly type: ImageType;
    readonly width: number;
    readonly height: number;
}

export type ImageType = 'image/png' | 'image/jpeg';

export type ImageData = ArrayBuffer | DataURL | HTMLImageElement;

/**
 * Functions for working with canvas objects, extracting screenshots, etc.
 */
export class Canvases {

    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/pdf-loader.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/extractor.js
    // https://github.com/burtonator/pdf-annotation-exporter/blob/master/webapp/js/debug-canvas.js

    /**
     * Take a canvas or an ArrayBuffer and convert it to a data URL without
     * limitations on the size of the URL.
     */
    public static async toDataURL(data: HTMLCanvasElement | ArrayBuffer,
                                  opts: ImageOpts = new DefaultImageOpts()): Promise<string> {

        // https://developer.mozilla.org/en-US/docs/Web/API/Blob

        const toArrayBuffer = async (): Promise<ArrayBuffer> => {

            if (data instanceof HTMLCanvasElement) {
                return await this.toArrayBuffer(data, opts);
            }

            return data;

        };

        const ab = await toArrayBuffer();

        const encoded = ArrayBuffers.toBase64(ab);

        return `data:${DEFAULT_IMAGE_TYPE};base64,` + encoded;

    }

    public static toArrayBuffer(canvas: HTMLCanvasElement,
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
                    reject(new Error("No blob"));
                }

            }, opts.type, opts.quality);

        });

    }

    private static async createImageElementFromDataURL(image: DataURL): Promise<HTMLImageElement> {

        return new Promise<HTMLImageElement>((resolve, reject) => {

            const img = document.createElement("img") as HTMLImageElement;
            img.src = image;

            img.onload = () => resolve(img);

            img.onerror = (err) => reject(err);
            img.onabort = (err) => reject(err);

            return img;

        });
    }

    private static async createImageElement(image: ImageData): Promise<HTMLImageElement> {

        if (image instanceof HTMLImageElement) {
            return image;
        }

        if (image instanceof ArrayBuffer) {
            const dataURL = await this.toDataURL(image);
            return this.createImageElementFromDataURL(dataURL);
        }

        return this.createImageElementFromDataURL(image);

    }

    public static async crop(image: ImageData,
                             rect: ILTRect,
                             opts: CropOpts = new DefaultImageOpts()): Promise<DataURL> {

        const src = await this.createImageElement(image);

        const canvas = opts.canvas || document.createElement("canvas");

        canvas.width  = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d', {alpha: false})!;

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(src,
                      rect.left, rect.top, rect.width, rect.height,
                      0, 0, rect.width, rect.height);

        return canvas.toDataURL();

    }

    public static async resize(image: ImageData,
                               dimensions: IDimensions,
                               opts: ResizeOpts = new DefaultImageOpts()): Promise<ResizedImage> {

        const src = await this.createImageElement(image);

        const canvas = opts.canvas || document.createElement("canvas");

        const ctx = canvas.getContext('2d', {alpha: false})!;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const createSourceDimensions = () => {

            if (opts.keepAspectRatio) {
                const width = src.width;
                const idealHeight = src.width / (dimensions.width / dimensions.height);
                const height = Math.min(src.height, idealHeight);

                return {width, height};

            }

            return {width: src.width, height: src.height};

        };

        // TODO: keep aspect ratio of target option...
        const sourceDimensions = createSourceDimensions();

        // TODO: what the resulting image is not the height because the source dimensions were changed on us...

        ctx.drawImage(src, 0, 0, sourceDimensions.width, sourceDimensions.height,
                      0, 0, dimensions.width, dimensions.height);

        const dataURL = canvas.toDataURL();

        return {dataURL, size: dimensions};

    }

    /**
     * Extract image data from the given canvas directly and return it as an
     * array buffer.
     * @param canvas The canvas we should extract with.
     * @param rect The rect within the given canvas
     * @param opts The options for the image extraction
     */
    public static async extract(canvas: HTMLCanvasElement,
                                rect: ILTRect,
                                opts: ImageOpts = new DefaultImageOpts()): Promise<ExtractedImage> {

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

        const data = await this.toArrayBuffer(tmpCanvas, opts);

        const result = {
            data,
            width: canvasRect.width,
            height: canvasRect.height,
            type: opts.type
        };

        return result;

    }

}

export interface ResizedImage {
    readonly dataURL: DataURL;
    readonly size: IDimensions;
}

export interface CanvasOpts {
    canvas?: HTMLCanvasElement;
}

export interface CropOpts extends ImageOpts, CanvasOpts {
}

export interface ResizeOpts extends ImageOpts, CanvasOpts {
    readonly keepAspectRatio?: boolean;
}

export interface ImageOpts {
    readonly type: ImageType;
    readonly quality: number;
}

export class DefaultImageOpts implements ImageOpts {
    public readonly type = DEFAULT_IMAGE_TYPE;
    public readonly quality = DEFAULT_IMAGE_QUALITY;
}
