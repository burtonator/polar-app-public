import {Hashcode} from "../metadata/Hashcode";

export interface FileRef {

    readonly name: string;

    /**
     * The hashcode for the content.  For now the hashcode is STRONGLY preferred
     * but not required.
     */
    readonly hashcode?: Hashcode;

}
