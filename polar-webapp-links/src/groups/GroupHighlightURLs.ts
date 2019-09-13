export class GroupHighlightURLs {

    public static parse(url: string): GroupHighlightURL {
        const parts = url.split("/");
        const id = parts[parts.length - 1];
        return {id};
    }

}


export interface GroupHighlightURL {
    readonly id: string;
}
