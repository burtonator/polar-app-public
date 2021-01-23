export namespace Bytes {

    export type ByteStorageStr = string;

    export function toBytes(format: ByteStorageStr) {

        const suffix = format.replace(/^[0-9]+/, '');
        const prefix = parseInt(format.replace(/[^0-9]$/, ''))

        switch (suffix) {

            case "KB":
                return prefix * 1000
            case "KiB":
                return prefix * 1024

            case "MB":
                return prefix * 1000 * 1000
            case "MiB":
                return prefix * 1024 * 1024

            case "GB":
                return prefix * 1000 * 1000 * 1000
            case "GiB":
                return prefix * 1024 * 1024 * 1024

            default:
                throw new Error(`Unknown value: ${suffix}: ` + format);

        }

    }

    export function format(bytes: number): string {

        if (bytes < 1000) {
            return bytes +  "";
        } else if (bytes < 1000000) {
            return Math.floor(bytes / 1000) + " KB";
        } else if (bytes < 1000000000) {
            return Math.floor(bytes / 1000000) + " MB";
        } else if (bytes < 1000000000000) {
            return Math.floor(bytes / 1000000000) + " GB";
        } else if (bytes < 1000000000000000) {
            return Math.floor(bytes / 1000000000000) + " TB";
        }

        return bytes +  "";

    }

}
