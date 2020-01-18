import {SharedTags} from "./SharedTags";
import {TagDescriptor} from "../TagDescriptors";

export class SharedAnnotationTags {

    public static write(tags: ReadonlyArray<TagDescriptor>) {
        SharedTags.write('shared-tags:annotations', tags);
    }

    public static read(): ReadonlyArray<TagDescriptor> {
        return SharedTags.read('shared-tags:annotations');
    }

}
