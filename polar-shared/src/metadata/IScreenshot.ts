import {ISODateTimeString} from "./ISODateTimeStrings";
import {IImage} from "./IImage";

export interface IScreenshot extends IImage {


    /**
     * The unique ID for this object.
     */
    id: string;

    /**
     * The time this object was created
     *
     */
    created: ISODateTimeString;

}
