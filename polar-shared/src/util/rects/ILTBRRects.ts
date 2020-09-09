import {ILTBRRect} from "./ILTBRRect";
import {ILTRect} from "./ILTRect";

export namespace ILTBRRects {

    export function toLTRect(rect: ILTBRRect): ILTRect {
        return {
            left: rect.left,
            top: rect.top,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top,
        };

    }

}
