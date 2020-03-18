import {arrayStream} from "../util/ArrayStreams";
import {Tag} from "./Tags";

export interface ITagMap {
    [id: string]: Tag;
}

export interface InheritedTag extends Tag {

    /**
     * The source of this tag whether it be from the document or the annotation
     * itself.
     */
    readonly source: 'doc' | 'self';

}


export interface IInheritedTagMap {
    [id: string]: InheritedTag;
}

export function toSelfInheritedTags(tags: ITagMap | undefined | null): IInheritedTagMap {
    return arrayStream(Object.values(tags || {}))
        .map(toSelfInheritedTag)
        .toMap(current => current.id);
}

export function toSelfInheritedTag(tag: Tag): InheritedTag {
    return {...tag, source: 'self'};
}
