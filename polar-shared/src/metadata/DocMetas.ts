import {IDocMeta} from "./IDocMeta";
import {Preconditions} from "../Preconditions";
import {UUIDs} from "../../../../polar-bookshelf/web/js/metadata/UUIDs";
import {DocMeta} from "../../../../polar-bookshelf/web/js/metadata/DocMeta";
import {Dictionaries} from "../util/Dictionaries";
import {ISODateTimeStrings} from "./ISODateTimeStrings";

export namespace DocMetas {

    export function getPageMeta(docMeta: IDocMeta, num: number) {

        Preconditions.assertPresent(docMeta, "docMeta");
        Preconditions.assertPresent(num, "num");

        const pageMeta = docMeta.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

    /**
     * Create a copy of the DocMeta and with updated lastUpdate fields and
     * a new UUID.
     */
    export function updated(docMeta: IDocMeta): IDocMeta {

        docMeta = Dictionaries.copyOf(docMeta);

        docMeta.docInfo.lastUpdated = ISODateTimeStrings.create();
        docMeta.docInfo.uuid = UUIDs.create();

        const docInfo = Dictionaries.copyOf(docMeta.docInfo);
        return Object.assign(new DocMeta(docInfo, {}), docMeta);

    }


}
