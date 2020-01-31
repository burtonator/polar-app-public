import {FetchOptions, ResourceLoader} from "jsdom";

export class ContentResourceLoader extends ResourceLoader {

    public constructor(public readonly contentMap: ContentMap,
                       public readonly required: boolean = true) {
        super();
    }

    public fetch(url: string, options: FetchOptions): Promise<Buffer> | null {

        const content = this.contentMap[url];

        // Override the contents of this script to do something unusual.
        if (content) {
            const result = Buffer.from(content);

            (<any>result).headers = {
                'content-type': 'text/html'
            };

            return Promise.resolve(result);
        }

        if (this.required) {
            throw new Error("Resource not found but required: " + url);
        }

        return super.fetch(url, options);

    }

}

export interface ContentMap {
    [url: string]: string;
}
