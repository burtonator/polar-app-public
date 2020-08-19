/**
 * A pagemark anchor for positioning a pagemark in a fluid / responsive document
 * format like EPUB.
 */
export interface IPagemarkAnchor {
    readonly type: 'epubcfi';
    readonly value: string;
}
