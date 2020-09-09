import {ILTRect} from "./ILTRect";
import {ILTBRRect} from "./ILTBRRect";
import {ILTBRRects} from "./ILTBRRects";

export namespace ILTRects {

    export function toLTBRRect(rect: ILTRect): ILTBRRect {

        return {
            left: rect.left,
            top: rect.top,
            right: rect.left + rect.width,
            bottom: rect.top + rect.height
        };

    }

    export function withinBounds(rect: ILTRect, bounds: ILTRect) {

        const rectLTBR = toLTBRRect(rect);
        const boundsLTBR = toLTBRRect(bounds);

        const bounded: ILTBRRect = {
            left: Math.max(rect.left, bounds.left),
            top: Math.max(rect.top, bounds.top),
            right: Math.min(rectLTBR.right, boundsLTBR.right),
            bottom: Math.min(rectLTBR.bottom, boundsLTBR.bottom),
        };

        return ILTBRRects.toLTRect(bounded);

    }

}
