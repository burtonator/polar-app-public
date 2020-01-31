import {ISODateTimeString, ISODateTimeStrings} from "../metadata/ISODateTimeStrings";

export class Dates {
    public static toDate(date: Date | ISODateTimeString) {

        if (typeof date === 'string') {
            return ISODateTimeStrings.parse(date);
        }

        return date;

    }
}
