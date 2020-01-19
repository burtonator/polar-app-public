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

}

export class URLParams {

    public static parse(url: string): URLParamsIndex {

        const parseQueryString = () => {

            const start = url.indexOf('?');
            if (start !== -1) {
                return url.substring(start + 1);
            }

            return undefined;

        };

        const qs = parseQueryString();

        if (! qs) {
            return new URLParamsIndex({});
        }

        const keyValuePairs = qs.split('&');

        const params: URLParamDict = {};

        keyValuePairs.map(keyValuePair => {
            const [key, val] = keyValuePair.split('=');
            params[key] = decodeURIComponent(val);
        });

        return new URLParamsIndex(params);

    }

}
