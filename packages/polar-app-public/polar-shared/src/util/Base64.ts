/**
 * A Base64 encoded string.
 */
export type Base64Str = string;

export class Base64 {

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
    //
    // https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/

    public static encode(data: string): string {

        if (typeof btoa !== 'undefined') {
            return btoa(data);
        } else {
            const buff = new Buffer(data);
            return buff.toString('base64');
        }

    }

    public static btoa(data: string): string {
        if (typeof btoa !== 'undefined') {
            return btoa(data);
        } else {
            const buff = new Buffer(data);
            return buff.toString('base64');
        }
    }

    public static atob(data: string): string {
        if (typeof atob !== 'undefined') {
            return atob(data);
        } else {
            return Buffer.from(data, 'base64').toString();
        }
    }

}
