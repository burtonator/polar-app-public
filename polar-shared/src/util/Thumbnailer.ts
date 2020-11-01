import {PathOrURLStr} from "./Strings";
import {IDimensions} from "./IDimensions";

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