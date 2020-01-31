export class Uint8Arrays {

    public static toBase64(bytes: Uint8Array) {

        let binary = '';
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return btoa(binary);

    }

}
