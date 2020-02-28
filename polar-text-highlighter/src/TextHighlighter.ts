import {IRect, MutableIRect} from "polar-shared/src/util/rects/IRect";

function getScrollParent(element: HTMLElement | undefined): HTMLElement | undefined {

    if (! element) {
        return undefined;
    }

    if (element.scrollHeight > element.clientHeight) {
        return element;
    } else {
        return getScrollParent(element.parentElement || undefined);
    }

}

export interface ITextHighlighterOpts {
    readonly id: string;
}

export class TextHighlighter {

    private static applyHighlight(opts: ITextHighlighterOpts) {

    }

}

class IntersectRects {

    public static compute(a: IRect, b: IRect): IRect {

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
