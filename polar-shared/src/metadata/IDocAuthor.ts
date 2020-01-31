export interface IDocAuthor {

    /**
     * The name to show in the UI.  Usually a combination between the first
     * and last name.
     */
    readonly displayName: string;

    /**
     * The first name of the author.
     */
    readonly firstName?: string;

    /**
     * The last name of the author.
     */
    readonly lastName?: string;

}