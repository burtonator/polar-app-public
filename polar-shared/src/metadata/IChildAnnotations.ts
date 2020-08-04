import {INote} from "./INote";
import {IQuestion} from "./IQuestion";
import {IFlashcard} from "./IFlashcard";

/**
 * An object that supports child annotations like notes, questions, and flashcards.
 */
export interface IChildAnnotations {

    readonly notes: { [key: string]: INote };
    readonly questions: { [key: string]: IQuestion };
    readonly flashcards: { [key: string]: IFlashcard };

}
