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

}
