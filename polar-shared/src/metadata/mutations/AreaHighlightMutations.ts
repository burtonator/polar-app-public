import {IPageMeta} from "../IPageMeta";
import {IDValueMap, MutatorDelegate} from "./PageMetaMutations";
import {IAreaHighlight} from "../IAreaHighlight";

class Delegate extends MutatorDelegate<IAreaHighlight> {

    protected toValues(pageMeta: IPageMeta): IDValueMap<IAreaHighlight> {
        return pageMeta.areaHighlights || {};
    }

}

export class AreaHighlightMutations {

    public static instance = new Delegate();

}
