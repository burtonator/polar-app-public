import {URL} from 'whatwg-url';

export interface URLParamDict {
    [key: string]: string;
}

export class URLParamsIndex {

    constructor(private backing: URLParamDict ) {
    }

    public get(key: string): string | undefined {
        const value = this.backing[key];
        return value || undefined;
    }

    public toJSON() {
        return JSON.stringify(this.backing);
    }

}

export class URLParams {

    public static parse(url: string) {

        const parsedURL = new URL(url);

        const params: URLParamDict = {};

        for (const [key, value] of parsedURL.searchParams) {
            params[key] = value;
        }

        return new URLParamsIndex(params);

    }

}

