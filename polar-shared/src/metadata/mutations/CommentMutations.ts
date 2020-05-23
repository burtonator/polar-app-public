import {IPageMeta} from "../IPageMeta";
import {IDValueMap, MutatorDelegate} from "./PageMetaMutations";
import {IComment} from "../IComment";

class Delegate extends MutatorDelegate<IComment> {

    protected toValues(pageMeta: IPageMeta): IDValueMap<IComment> {
        return pageMeta.comments;
    }

}

export class CommentMutations {

    public static instance = new Delegate();

}
