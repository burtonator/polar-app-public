import {FlashcardType} from "./FlashcardType";
import {Text} from "./Text";
import {IAnnotation} from "./IAnnotation";

export interface IFlashcard extends IAnnotation {

    /**
     * The type of this flashcard.
     */
    type: FlashcardType;

    /**
     * The content of this flashcard created by the user.
     */
    fields: { [key: string]: Text };

    /**
     * The archetype ID used to create this flashcard.
     */
    archetype: string;

}
