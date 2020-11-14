import {Tag} from "./Tags";

export namespace TagFilters {

    /**
     * Only folders (no tags).
     */
    export function onlyFolderTags(tag: Tag) {
        return tag.label.startsWith('/');
    }

    /**
     * Only tags (no folders).
     */
    export function onlyRegular<T extends Tag>(tag: T): boolean {
        return ! tag.label.startsWith('/');
    }

}
