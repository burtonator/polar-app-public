import {TagDescriptor} from "../TagDescriptors";
import {SharedTags} from "./SharedTags";

export class SharedDocTags {

    public static write(tags: ReadonlyArray<TagDescriptor>) {
        SharedTags.write('shared-tags:docs', tags);
    }

    public static read(): ReadonlyArray<TagDescriptor> {
        return SharedTags.read('shared-tags:docs');
    }
}
