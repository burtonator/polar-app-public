import {Text} from "./Text";
import {INote} from "./INote";
import {IQuestion} from "./IQuestion";
import {IFlashcard} from "./IFlashcard";
import {IAnnotation} from "./IAnnotation";
import {HighlightColor} from "./IBaseHighlight";
import {IImage} from "./IImage";
import {ITextRect} from "./ITextRect";
import {IRect} from "../util/rects/IRect";

export interface ITextHighlight extends IAnnotation {

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

    readonly rects: { [key: number]: IRect };
    readonly image?: IImage;
    readonly images: { [key: string]: IImage };
    readonly notes: { [key: string]: INote };
    readonly questions: { [key: string]: IQuestion };
    readonly flashcards: { [key: string]: IFlashcard };
    readonly color?: HighlightColor;

}
