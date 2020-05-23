import {IPageMeta} from "../IPageMeta";
import {IDValueMap, MutatorDelegate} from "./PageMetaMutations";
import {IFlashcard} from "../IFlashcard";

class Delegate extends MutatorDelegate<IFlashcard> {

    protected toValues(pageMeta: IPageMeta): IDValueMap<IFlashcard> {
        return pageMeta.flashcards || {};
    }

}

export class FlashcardMutations {

    public static instance = new Delegate();

}
