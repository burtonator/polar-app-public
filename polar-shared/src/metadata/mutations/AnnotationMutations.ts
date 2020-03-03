import {AnnotationType} from "../AnnotationType";
import {ITextHighlight} from "../ITextHighlight";
import {IAreaHighlight} from "../IAreaHighlight";
import {IFlashcard} from "../IFlashcard";
import {IComment} from "../IComment";
import {IDocMeta} from "../IDocMeta";
import {FlashcardMutations} from "./FlashcardMutations";
import {CommentMutations} from "./CommentMutations";
import {TextHighlightMutations} from "./TextHighlightMutations";
import {AreaHighlightMutations} from "./AreaHighlightMutations";

export class AnnotationMutations {

    public static update(docMeta: IDocMeta,
                         annotationType: AnnotationType,
                         value: ITextHighlight | IAreaHighlight | IFlashcard | IComment) {

        if (annotationType === AnnotationType.FLASHCARD) {
            FlashcardMutations.instance.update(docMeta, <IFlashcard> value);
        } else if (annotationType === AnnotationType.COMMENT) {
            CommentMutations.instance.update(docMeta, <IComment> value);
        } else if (annotationType === AnnotationType.TEXT_HIGHLIGHT) {
            TextHighlightMutations.instance.update(docMeta, <ITextHighlight> value);
        } else if (annotationType === AnnotationType.AREA_HIGHLIGHT) {
            AreaHighlightMutations.instance.update(docMeta, <IAreaHighlight> value);
        }

    }

    public static delete(docMeta: IDocMeta,
                         annotationType: AnnotationType,
                         value: ITextHighlight | IAreaHighlight | IFlashcard | IComment) {

        if (annotationType === AnnotationType.FLASHCARD) {
            FlashcardMutations.instance.delete(docMeta, <IFlashcard> value);
        } else if (annotationType === AnnotationType.COMMENT) {
            CommentMutations.instance.delete(docMeta, <IComment> value);
        } else if (annotationType === AnnotationType.TEXT_HIGHLIGHT) {
            TextHighlightMutations.instance.delete(docMeta, <ITextHighlight> value);
        } else if (annotationType === AnnotationType.AREA_HIGHLIGHT) {
            AreaHighlightMutations.instance.delete(docMeta, <IAreaHighlight> value);
        }

    }


}
