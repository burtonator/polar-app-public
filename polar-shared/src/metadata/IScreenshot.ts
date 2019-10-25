import {ISODateTimeString} from "./ISODateTimeStrings";
import {IImage} from "./IImage";

export interface IScreenshot extends IImage {


    /**
     * The unique ID for this object.
     */
    readonly id: string;

    /**
     * The time this object was created
     *
     */
    readonly created: ISODateTimeString;

}
