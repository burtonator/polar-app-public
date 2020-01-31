import {IXYRect} from './IXYRect';

export class IXYRects {

    public static createFromClientRect(clientRect: ClientRect): IXYRect {

        return {
            x: clientRect.left,
            y: clientRect.top,
            width: clientRect.width,
            height: clientRect.height
        };

    }

    public static instanceOf(val: any): val is IXYRect {

        return val.x !== undefined &&
            val.y !== undefined &&
            val.width !== undefined &&
            val.height !== undefined;

    }

}
