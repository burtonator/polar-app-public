import {BackendFileRef} from "../datastore/BackendFileRef";

export type IImageRel = 'screenshot' | 'thumbnail' | 'highlight' | string;

export interface IImage {

    /**
     * A unique ID for this image which is used to store in keys and uniquely
     * represents this image.
     */
    readonly id: string;

    /**
     * The type of this image.
     */
    readonly type: ImageType;

    /**
     * The src of this Image as backed in the datastore.
     */
    readonly src: BackendFileRef;

    /**
     * The width of this image.
     */
    readonly width?: number;

    /**
     * The height of this image.
     *
     * @type {number}
     */
    readonly height?: number;

    /**
     * A per image 'relation' similar to the HTML rel attribute with links.
     * This allow us to attach an image to an annotation and give it a relation.
     *
     * For example.  We could have 'screenshot', 'thumbnail', 'highlight', etc.
     *
     * These relations are free form so any relation type can be designed by
     * the developer and still compatible with the schema.  Standard relations
     * are and will be defined and future relations can be added at any point.
     */
    readonly rel?: IImageRel;

}

export type ImageType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/svg+xml' | 'image/avif' | 'image/apng';
