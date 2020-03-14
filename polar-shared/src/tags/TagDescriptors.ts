import {Dictionaries} from "../util/Dictionaries";
import {Tag, Tags} from "./Tags";
import {IDStr} from "../util/Strings";

/**
 * A tag but also the data about the number of records that match this tag.
 */
export interface TagDescriptor extends Tag {

    /**
     * Total number of items in this tag.
     */
    readonly count: number;

    /**
     * The IDs of all the documents that are a member of this tag.
     */
    readonly members: ReadonlyArray<IDStr>;

}

export class TagDescriptors {

    /**
     * From a union of the two tag arrays...
     */
    public static merge(docTags: ReadonlyArray<TagDescriptor> | undefined, userTags: ReadonlyArray<Tag> | undefined): ReadonlyArray<TagDescriptor> {

        docTags = docTags || [];

        const result: { [id: string]: TagDescriptor } = {};

        Dictionaries.putAll(Tags.toMap(docTags), result);

        for (const userTag of userTags || []) {

            if (result[userTag.id]) {
                // we already have an existing tag descriptor here.
                continue;
            }

            result[userTag.id] = {
                ...userTag, count: 0, members: []
            };

        }

        return Object.values(result);

    }

    /**
     * We filter out tags that only have members.
     */
    public static filterWithMembers(tags: ReadonlyArray<TagDescriptor>): ReadonlyArray<TagDescriptor> {
        return tags.filter(tag => tag.count > 0);
    }


}
