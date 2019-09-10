
export class GroupURLs {

    public static parse(url: string): GroupURL {

        const regex = /[/#]group\/([^/]+)/;
        const matches = url.match(regex);
        if (matches && matches[1]) {
            const name = matches[1];
            return {name}
        }

        throw new Error("No group name");

    }

}

export interface GroupURL {
    // TODO: should be GroupNameStr
    readonly name: string;
}
