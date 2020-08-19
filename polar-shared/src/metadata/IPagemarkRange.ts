import {IPagemarkAnchor} from "./IPagemarkAnchor";

/**
 * A pagemark range that can cover a prefix, suffix, and the entire page.
 */
export type IPagemarkRange = IPagemarkRangePrefix | IPagemarkRangeSuffix | IPagemarkRangeFull;

/**
 * A pagemark range that is a prefix coverage that covers from the start of
 * the document up until the 'end'.
 */
export interface IPagemarkRangePrefix {
    readonly end: IPagemarkAnchor;
}

/**
 * A pagemark range that is a suffix coverage that covers from the end of
 * the document up until the 'start'.
 */
export interface IPagemarkRangeSuffix {
    readonly start: IPagemarkAnchor;
}

/**
 * A full range that covers an explicit start and end range denoted by CFIs.
 */
export interface IPagemarkRangeFull {
    readonly start: IPagemarkAnchor;
    readonly end: IPagemarkAnchor;
}
