import {ISODateTimeString} from "./ISODateTimeStrings";

export interface IThumbnail {

    /**
     * The unique ID for this object.
     */
    readonly id: string;

    /**
     * The time this object was created
     *
     */
    created: ISODateTimeString;

}
