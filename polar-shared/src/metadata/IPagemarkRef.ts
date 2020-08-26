import {IPagemark} from "./IPagemark";

/**
 * Reference to a pagemark including the page number.
 */
export interface IPagemarkRef {
    readonly pageNum: number;
    readonly pagemark: IPagemark;
}

