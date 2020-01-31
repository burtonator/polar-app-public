import {TagDescriptor} from "../TagDescriptors";

export class SharedTags {

    public static write(key: string, tags: ReadonlyArray<TagDescriptor>) {
        const json = JSON.stringify(tags);
        localStorage.setItem(key, json);
    }

    public static read(key: string): ReadonlyArray<TagDescriptor> {

        const data = localStorage.getItem(key);

        if  (data) {
            return JSON.parse(data);
        } else {
            return [];
        }

    }

}
