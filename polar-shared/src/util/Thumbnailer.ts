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

export namespace Thumbnailers {

    export interface ScaledDimensions {
        readonly scale: number;
        readonly width: number;
        readonly height: number;
    }

    export function computeScaleDimensions(opts: ThumbnailerGenerateOpts,
                                           original: IDimensions): ScaledDimensions {

        function computeScaleValue(dimension: 'width' | 'height') {
            return opts.scaleBy === dimension ? opts.value : original[dimension] * scale
        }

        const scale = opts.value / original[opts.scaleBy];

        return {
            scale,
            width: computeScaleValue('width'),
            height: computeScaleValue('height')
        };

    }

}