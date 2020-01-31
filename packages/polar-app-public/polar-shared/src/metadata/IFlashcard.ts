import {IVersionedObject} from "./IVersionedObject";
import {FlashcardType} from "./FlashcardType";
import {Text} from "./Text";

export interface IFlashcard extends IVersionedObject {

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
