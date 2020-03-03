import {IDocMeta} from "../IDocMeta";
import {ICommentMap, IPageMeta} from "../IPageMeta";
import {IComment} from "../IComment";

export type CommentsCallback = (pageMeta: IPageMeta, comments: ICommentMap) => boolean;

export class CommentMutations {

    public static update(docMeta: IDocMeta, comment: IComment): boolean {

        return this.forEachPageMeta(docMeta, (pageMeta, comments) => {

            if (comments[comment.id]) {
                comments[comment.id] = comment;
                return true;
            }

            return false;

        });

    }

    public static delete(docMeta: IDocMeta, comment: IComment): boolean {

        return this.forEachPageMeta(docMeta, (pageMeta, comments) => {

            if (comments[comment.id]) {
                delete comments[comment.id];
                return true;
            }

            return false;

        });

    }

    private static forEachPageMeta(docMeta: IDocMeta, callback: CommentsCallback): boolean {

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const comments = pageMeta.comments || {};

            if (callback(pageMeta, comments)) {
                return true;
            }

        }

        return false;

    }

}
