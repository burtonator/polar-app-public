import {AbstractPHZWriter} from "./AbstractPHZWriter";
import {Base64Str} from "polar-shared/src/util/Base64";

/**
 * Write to the output to JSZip internally but then get the output directly from JSZip as a blob or other in-memory
 * representation.
 */
export class DirectPHZWriter extends AbstractPHZWriter {

    constructor() {
        super();
    }

    public async toBase64(): Promise<Base64Str> {
        return await this.zip.generateAsync({type: 'base64'});
    }

    public async toBlob(): Promise<Blob> {
        return await this.zip.generateAsync({type: 'blob'});
    }

}
