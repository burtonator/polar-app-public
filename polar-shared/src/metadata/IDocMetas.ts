import {IDocMeta} from "./IDocMeta";
import {Preconditions} from "../Preconditions";

export namespace IDocMetas {

    export function getPageMeta(docMeta: IDocMeta, num: number) {

        Preconditions.assertPresent(docMeta, "docMeta");
        Preconditions.assertPresent(num, "num");

        const pageMeta = docMeta.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

}
