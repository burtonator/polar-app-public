import {IRect, MutableIRect} from "polar-shared/src/util/rects/IRect";

export namespace IntersectRects {

    export function compute(a: IRect, b: IRect): IRect {

        const result: MutableIRect = {
            top: Math.max(a.top, b.top),
            bottom: Math.min(a.bottom, b.bottom),
            left: a.left,
            right: a.right,
            height: 0,
            width: 0
        };

        result.height = result.bottom - result.top;
        result.width = result.right - result.left;

        return result;

    }

}
