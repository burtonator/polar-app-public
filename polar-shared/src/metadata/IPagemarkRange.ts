import {IPagemarkAnchor} from "./IPagemarkAnchor";

/**
 * A pagemark range that can cover a prefix, suffix, and the entire page.
 */
export interface IPagemarkRange {
    readonly start?: IPagemarkAnchor;
    readonly end?: IPagemarkAnchor;
}
