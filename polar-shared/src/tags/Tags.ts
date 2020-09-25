import twitter_txt from 'twitter-text';
import {isPresent} from '../Preconditions';
import {Optional} from '../util/ts/Optional';
import {Dictionaries} from '../util/Dictionaries';
import {SetArrays} from "../util/SetArrays";
import {IDStr} from "../util/Strings";
import {Arrays} from "../util/Arrays";
import {arrayStream} from "../util/ArrayStreams";

export type TagType = 'tag' | 'folder';

export namespace Tags {

    export function sortByLabel(tags: ReadonlyArray<Tag>): ReadonlyArray<Tag> {
        return [...tags].sort((a, b) => a.label.localeCompare(b.label));
    }

    export function regularTagsThenFolderTagsSorted(tags: ReadonlyArray<Tag>): ReadonlyArray<Tag> {

        const regularTags = sortByLabel(onlyRegular(tags));
        const folderTags = sortByLabel(onlyFolderTags(tags));

        return [...regularTags, ...folderTags];

    }

    /**
     * Only folders (no tags).
     */
    export function onlyFolderTags(tags: ReadonlyArray<Tag>): ReadonlyArray<Tag> {
        return tags.filter(tag => tag.label.startsWith('/'));
    }

    /**
     * Only tags (no folders).
     */
    export function onlyRegular<T extends Tag>(tags: ReadonlyArray<T>): ReadonlyArray<T> {
        return tags.filter(tag => ! tag.label.startsWith('/'));
    }

    export function create(label: string): Tag {
        return {id: label, label};
    }

    /**
     * Get a basename for a label without the prefix.
     * @param label
     */
    export function basename(label: string): string {
        return Arrays.last(label.split('/'))!;
    }

    export function assertValid(label: string) {

        if (!validate(label).isPresent()) {
            throw new Error("Invalid tag: " + label);
        }

    }

    export function validate(label: string): Optional<string> {

        if (!isPresent(label)) {
            return Optional.empty();
        }

        if (!label.startsWith('#')) {
            label = '#' + label;
        }

        const strippedLabel = stripTag(label);

        if ( ! strippedLabel.isPresent()) {
            return Optional.empty();
        }

        if (twitter_txt.isValidHashtag(strippedLabel.get())) {
            return Optional.of(label);
        }

        return Optional.empty();

    }

    export function validateTag(tag: Tag): Optional<Tag> {

        if (validate(tag.label).isPresent()) {
            return Optional.of(tag);
        }

        return Optional.empty();

    }

    /**
     * Return true if all the tags are valid.  If no tags are given we return
     * true as the input set had no valid tags.
     */
    export function tagsAreValid(...tags: Tag[]): boolean {

        return tags.map(tag => validateTag(tag).isPresent())
                   .reduce((acc, curr) => ! acc ? false : curr, true);

    }

    /**
     * Return tags that are invalid.
     * @param tags
     */
    export function findInvalidTags(...tags: Tag[]): Tag[] {
        return tags.filter(tag => ! validateTag(tag).isPresent());
    }

    export function findValidTags(...tags: Tag[]): Tag[] {
        return tags.filter(tag => validateTag(tag).isPresent());
    }

    export function toMap(tags: ReadonlyArray<Tag>) {

        const result: { [id: string]: Tag } = {};

        for (const tag of tags) {
            result[tag.id] = tag;
        }

        return result;

    }

    /**
     * From a union of the two tag arrays...
     *
     * TODO: is actually a toSet or a intersection but not a union.
     */
    export function union(a: ReadonlyArray<Tag>, b: ReadonlyArray<Tag>): ReadonlyArray<Tag> {

        const result: { [id: string]: Tag } = {};

        Dictionaries.putAll(Tags.toMap(a), result);
        Dictionaries.putAll(Tags.toMap(b), result);

        return Object.values(result);

    }

    /**
     * Difference (a \ b): create a set that contains those elements of set a
     * that are not in set b
     *
     */
    export function difference(a: ReadonlyArray<Tag>, b: ReadonlyArray<Tag>): ReadonlyArray<Tag> {
        const diff = b.map(current => current.id);
        return a.filter(current => ! diff.includes(current.id));
    }

    export function toIDs(tags: ReadonlyArray<Tag>) {
        return tags.map(current => current.id);
    }

    export function stripTag(tag: TagStr): Optional<string> {
        return stripTypedTag(stripTagInvalidChars(tag));
    }


    /**
     * Remove spaces, dashes, etc from the tag to use all the other validations.  We work with spaces in tags, they're
     * just not usable in other systems like Twitter tags so users have to be careful.  But many people insist upon
     * them.
     */
    export function stripTagInvalidChars(tag: TagStr): string {
        return tag.replace(/[- ]+/g, '');
    }

    /**
     * We support foo:bar values in tags so that we can have typed tags.
     * For example: type:book or deck:fun or something along those lines.
     *
     * We also support / to denote hierarchy, like deck:main/sub
     *
     * @VisibleForTesting
     */
    export function stripTypedTag(tag: TagStr): Optional<string> {

        const match = tag.match(/:/g);

        if (match && match.length > 1) {
            // too many colons so this is invalid
            return Optional.empty();
        }

        // Remove any single lonely slashes
        const noslashes = tag.replace(/([^\/])\/([^\/])/g, '$1$2');

        // If there are any slashes left, we don't like it.
        if (noslashes.match(/\//g)) {
            return Optional.empty();
        }

        return Optional.of(noslashes.replace(/^#([^:/]+):([^:]+)$/g, '#$1$2'));
    }

    export function parseTypedTag(value: string): Optional<TypedTag> {

        value = value.replace("#", "");
        const split = value.split(":");

        return Optional.of({
            name: split[0],
            value: split[1]
        });
    }

    /**
     * Find any records in the given array with the given tags.
     */
    export function computeRecordsTagged<R extends TaggedRecord>(records: ReadonlyArray<R>,
                                                                 tags: ReadonlyArray<TagStr>): ReadonlyArray<R> {

        const index: {[id: string]: R} = {};

        for (const record of records) {

            if (SetArrays.intersects(record.tags || [], tags)) {
                index[record.id] = record;
            }

        }

        return Object.values(index);

    }

    export type TagID = IDStr;

    export type TagLabel = string;

    /**
     * A tag literal is either the id or the label.
     */
    export type TagLiteral = TagID | TagLabel;

    /**
     * Lookup a tag by its literal.  The input can be either a tag id or a label
     * but we lookup against the ID.
     *
     * @param tags the tag index
     * @param tagLabels The labels we're working with
     * @param tagFactory called when we can't find the literal in the index to create a new one.
     */
    export function lookupByTagLiteral(tags: ReadonlyArray<Tag>,
                                       tagLabels: ReadonlyArray<TagLiteral>,
                                       tagFactory: (literal: TagLiteral) => Tag | undefined = () => undefined): ReadonlyArray<Tag> {

        const tagMap = arrayStream(tags)
            .toMap(current => current.id);

        return tagLabels.map(current => tagMap[current] || tagFactory(current))
                        .filter(isPresent);

    }

    /**
     * When a tag operation is executed we can either set the tags one very item
     * or add to the existing set.
     */
    export type ComputeNewTagsStrategy = 'set' | 'add'

    export function computeNewTags(currentTags: Readonly<{[id: string]: Tag}> | undefined,
                                   mutationTags: ReadonlyArray<Tag>,
                                   strategy: ComputeNewTagsStrategy): ReadonlyArray<Tag> {

        const currentTagsArray = Object.values(currentTags || {});

        if (strategy === 'set') {
            return mutationTags;
        }

        // add strategy...
        return Tags.union(currentTagsArray, mutationTags);

    }


}

export interface Tag {

    /**
     * The actual id for the tag which is unique across all tags.
     */
    readonly id: string;

    /**
     * The label to show in the UI.
     */
    readonly label: string;

    /**
     * True when the tag is hidden.  Used for special types of tags that should
     * not be shown in the UI as they would just clutter the UI.
     */
    readonly hidden?: boolean;

}

/**
 * A tag like deck:foo
 */
export interface TypedTag {

    /**
     */
    readonly name: string;

    /**
     */
    readonly value: string;

}

/**
 * An object that contains tags.
 */
export interface TaggedRecord {
    readonly id: IDStr;
    readonly tags?: ReadonlyArray<TagStr>;
}

/**
 * A string representation of a tag.
 */
export type TagStr = string;

/**
 * Just the tag ID, not the TagStr (which might not be unique).
 */
export type TagIDStr = string;


