import {Text} from "./Text";
import {IBaseHighlight} from "./IBaseHighlight";
import {ITextRect} from "./ITextRect";
import {IChildAnnotations} from "./IChildAnnotations";

export interface ITextHighlight extends IBaseHighlight, IChildAnnotations {

    /**
     * Specify a specific type of text highlight.
     *
     * text-only: textSelections doesn't exist nor does rects as it isn't
     *            manually placed on the page but is placed by the text.
     */
    readonly type?: 'text-only';

    readonly textSelections: { [id: number]: ITextRect };

    readonly text: Text | string;

    /**
     * User edited/revised text for the highlight.
     */
    readonly revisedText?: Text | string;

}
