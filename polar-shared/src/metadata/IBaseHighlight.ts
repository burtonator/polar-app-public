import {NamedColor, RGBStr} from "./HighlightColor";
import {IImage} from "./IImage";
import {IRect} from "../util/rects/IRect";
import {IAnnotation} from "./IAnnotation";

/**
 * The set of highlight colors.  We also provide transparent for text you want
 * to index but might not actually want visible in the document. We can use this
 * for secondary / anonymous highlights like notes and comments which might
 * not need to be visibly shown.
 */

export type HighlightColor = NamedColor | RGBStr;

export interface HighlightRects {
    [key: string]: IRect;
}

/**
 * An arbitrary position in the rendered page so that we can sort the
 * annotations based on their position on the page.  Used as an alternative
 * to 'position'.
 */
export type AnnotationOrder = number;

export interface IBaseHighlight extends IAnnotation {

    /**
     * The rectangles where we need to place content for this highlights.
     */
    rects: HighlightRects;

    /**
     * Optional image for this highlight taken when the highlight was created.
     * This is usually a screenshot of the annotation and what it looks like on
     * screen.  This is the primary image for this highlight and not includes in
     * the images below which are optional / secondary images.
     */
    image?: IImage;

    /**
     * Images for this highlight.  By default there are none.
     */
    images: {[key: string]: IImage};

    /**
     * The color of this highlight. Defaults to yellow if undefined.
     */
    color?: HighlightColor;

    /**
     * @see Position Documentation for this design is there.
     */
    position?: Position;

    /**
     * True if the user has flagged this highlight.  This can be used to call
     * to action that this annotation needs further editing, is important, etc.
     */
    flagged?: boolean;

    /**
     * Works with position to help place the annotations on the page but order
     * is approximate and this can also be used to reorder the sidebar manually.
     */
    order?: AnnotationOrder;

}

/**
 * The position of a highlight is the absolute position on the page in pixels
 * at 100% zoom level.  Some systems (like pagemarks and area highlights) use
 * percentage placement but text highlights use absolute placement (a poor
 * design issue) but we have to unify on absolute for compatibility reasons
 * with text highlights.  We could later add both systems but we need to at
 * least have the absolute position for portability reasons for area
 * highlights.
 */
export interface Position {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

