import {PathOrURLStr} from "./Strings";
import {IDimensions} from "./IDimensions";
import {ImageData} from "./Canvases";

export type DataURL = string;

export type ImageType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

export interface ThumbnailerGenerateOpts {
    readonly pathOrURL: PathOrURLStr;
    readonly scaleBy: 'width' | 'height';
    readonly value: number;
}

export interface IThumbnail extends ImageData {
    readonly scaledDimensions: IDimensions;
    readonly nativeDimensions: IDimensions;
}

export interface Thumbnailer {
    readonly generate: (opts: ThumbnailerGenerateOpts) => IThumbnail;
}