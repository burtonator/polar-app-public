import {IPageMeta} from "../IPageMeta";
import {IDValueMap, MutatorDelegate} from "./PageMetaMutations";
import {ITextHighlight} from "../ITextHighlight";

class Delegate extends MutatorDelegate<ITextHighlight> {

    protected toValues(pageMeta: IPageMeta): IDValueMap<ITextHighlight> {
        return pageMeta.textHighlights || {};
    }

}

export class TextHighlightMutations {

    public static instance = new Delegate();

}
