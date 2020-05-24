import {AnnotationType} from "../AnnotationType";
import {ITextHighlight} from "../ITextHighlight";
import {IAreaHighlight} from "../IAreaHighlight";
import {IFlashcard} from "../IFlashcard";
import {IComment} from "../IComment";
import {FlashcardMutations} from "./FlashcardMutations";
import {CommentMutations} from "./CommentMutations";
import {TextHighlightMutations} from "./TextHighlightMutations";
import {AreaHighlightMutations} from "./AreaHighlightMutations";
import {IAnnotationRefWithDocMeta} from "../AnnotationRefs";
import {IPagemark} from "../IPagemark";
import {PagemarkMutations} from "./PagemarkMutations";

export type AnnotationValueType = IPagemark | ITextHighlight | IAreaHighlight | IFlashcard | IComment

export class AnnotationMutations {

    public static update(ref: IAnnotationRefWithDocMeta,
                         value: AnnotationValueType) {

        const {annotationType} = ref;

        if (annotationType === AnnotationType.FLASHCARD) {
            FlashcardMutations.instance.update(ref, <IFlashcard> value);
        } else if (annotationType === AnnotationType.COMMENT) {
            CommentMutations.instance.update(ref, <IComment> value);
        } else if (annotationType === AnnotationType.TEXT_HIGHLIGHT) {
            TextHighlightMutations.instance.update(ref, <ITextHighlight> value);
        } else if (annotationType === AnnotationType.AREA_HIGHLIGHT) {
            AreaHighlightMutations.instance.update(ref, <IAreaHighlight> value);
        }

    }

    public static delete(ref: IAnnotationRefWithDocMeta) {

        const {annotationType} = ref;

        if (annotationType === AnnotationType.FLASHCARD) {
            FlashcardMutations.instance.delete(ref);
        } else if (annotationType === AnnotationType.COMMENT) {
            CommentMutations.instance.delete(ref);
        } else if (annotationType === AnnotationType.TEXT_HIGHLIGHT) {
            TextHighlightMutations.instance.delete(ref);
        } else if (annotationType === AnnotationType.AREA_HIGHLIGHT) {
            AreaHighlightMutations.instance.delete(ref);
        } else if (annotationType === AnnotationType.PAGEMARK) {
            PagemarkMutations.instance.delete(ref);
        }

    }

}
