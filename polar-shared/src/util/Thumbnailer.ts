import {PathOrURLStr} from "./Strings";
import {IDimensions} from "./IDimensions";

export type DataURL = string;

export type ImageType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

export interface ThumbnailerGenerateOpts {
    readonly pathOrURL: PathOrURLStr;
    readonly scaleBy: 'width' | 'height';
    readonly value: number;
}

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

export interface IThumbnail extends ImageData {
    readonly scaledDimensions: IDimensions;
    readonly nativeDimensions: IDimensions;
}

export interface Thumbnailer {
    readonly generate: (opts: ThumbnailerGenerateOpts) => IThumbnail;
}