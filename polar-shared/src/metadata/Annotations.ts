import {AnnotationType} from "./AnnotationType";
import {ITextHighlight} from "./ITextHighlight";
import {IAreaHighlight} from "./IAreaHighlight";
import {IFlashcard} from "./IFlashcard";
import { IComment } from "./IComment";
import {Texts} from "./Texts";
import {Text} from './Text';

export class Annotations {

    public static toText(type: AnnotationType,
                         annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard) {

        const obj = <any> annotation;

        let text: string | undefined;

        if (type === AnnotationType.FLASHCARD) {
            const flashcard = <IFlashcard> annotation;
            const textFields = Object.values(flashcard.fields);

            if (textFields.length > 0) {
                return Texts.toPlainText(textFields[0]);
            }

        }

        if (obj.text) {
            const sourceText: Text = obj.revisedText || obj.text;
            text = Texts.toPlainText(sourceText);
        }

        if (obj.content) {
            const sourceText: Text = obj.content;
            text = Texts.toPlainText(sourceText);
        }

        return text;

    }

}
