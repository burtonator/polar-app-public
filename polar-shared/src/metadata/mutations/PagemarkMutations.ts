import {IPageMeta} from "../IPageMeta";
import {IDValueMap, MutatorDelegate} from "./PageMetaMutations";
import {IAreaHighlight} from "../IAreaHighlight";
import {IPagemark} from "../IPagemark";

class Delegate extends MutatorDelegate<IPagemark> {

    protected toValues(pageMeta: IPageMeta): IDValueMap<IPagemark> {
        return pageMeta.pagemarks || {};
    }

}

export class PagemarkMutations {

    public static instance = new Delegate();

}
