import {IBaseHighlight} from "./IBaseHighlight";
import {INote} from "./INote";
import {IQuestion} from "./IQuestion";
import {IFlashcard} from "./IFlashcard";

export interface IAreaHighlight extends IBaseHighlight {

    readonly notes: {[key: string]: INote};

    readonly questions: {[key: string]: IQuestion};

    readonly flashcards: {[key: string]: IFlashcard};

}
