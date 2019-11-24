import {AnnotationType} from "./AnnotationType";
import {ITextHighlight} from "./ITextHighlight";
import {IAreaHighlight} from "./IAreaHighlight";
import {IFlashcard} from "./IFlashcard";
import {IComment} from "./IComment";
import {Texts} from "./Texts";
import {IText, ITextLike} from './Text';
import {ITextHighlights} from "./ITextHighlights";

export class Annotations {

    public static toHTML(type: AnnotationType,
                         annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard) {

        return Texts.toHTML(this.toIText(type, annotation));

    }

    public static toText(type: AnnotationType,
                         annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard) {

        return Texts.toText(this.toIText(type, annotation));

    }

    public static toIText(type: AnnotationType,
                          annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard): ITextLike | undefined {

        const obj = <any> annotation;

        if (type === AnnotationType.FLASHCARD) {
            const flashcard = <IFlashcard> annotation;
            const textFields = Object.values(flashcard.fields);

            if (textFields.length > 0) {
                return textFields[0];
            }

        }

        if (type === AnnotationType.TEXT_HIGHLIGHT) {
            return ITextHighlights.toIText(<ITextHighlight> annotation);
        }

        if (obj.text) {
            const sourceText: IText = obj.revisedText || obj.text;
            return sourceText;
        }

        if (obj.content) {
            const sourceText: IText = obj.content;
            return sourceText;
        }

        return undefined;

    }

}
