import {Strings} from '../util/Strings';
import {DurationStr, TimeDurations} from '../util/TimeDurations';

// TODO: these should all be Str not String

/**
 * An ISO Date with a Time
 */
export type ISODateTimeString = string;


/**
 * An ISO date with just year
 */
export type ISODateYearString = string;

/**
 * An ISO date with just year, and month
 */
export type ISODateYearMonthString = string;

/**
 * An ISO date with just year, month, and day.
 */
export type ISODateYearMonthDayString = string;

/**
 * An ISO Date string without a time.
 */
export type ISODateString = ISODateYearMonthDayString;

/**
 * Time represented as the number of milliseconds since Jan 1, 1970.
 */
export type UnixTimeMS = number;

export class ISODateTimeStrings {

    public static create(value?: Date | number): ISODateTimeString {

        let date: Date | undefined;

        if (value !== undefined) {

            if (value instanceof Date) {
                date = value;
            }

            if (typeof value === 'number') {
                date = new Date(value);
            }

        }

        if (!date) {
            date = new Date();
        }

        return date.toISOString();
    }

    public static adjust(datetime: ISODateTimeString, durationStr: DurationStr) {

        const date = this.parse(datetime);

        const unixtimeMillis = date.valueOf() - TimeDurations.toMillis(durationStr);

        return this.create(new Date(unixtimeMillis));

    }

    public static toISODateString(date: Date): ISODateString | undefined {

        if (!date) {
            return undefined;
        }

        const ordYear = date.getUTCFullYear();
        const ordMonth = date.getUTCMonth() + 1;
        const ordDay = date.getUTCDate();

        if (! ordYear || ! ordMonth || ! ordDay) {
            return undefined;
        }

        const year = Strings.lpad(ordYear, '0', 4);
        const month = Strings.lpad(ordMonth, '0', 2);
        const day = Strings.lpad(ordDay, '0', 2);

        return `${year}-${month}-${day}`;

    }

    /**
     * Round the date to the nearest hour.
     */
    public static toISODateStringRoundedToHour(date: Date | number | ISODateString) {

        // create a new date
        date = new Date(date);

        date.setUTCMilliseconds(0);
        date.setUTCSeconds(0);
        date.setUTCMinutes(0);

        return date.toISOString();

    }

    public static toISODateTimeString(date: Date) {
        return date.toISOString();
    }

    public static parse(value: string): Date {
        return new Date(Date.parse(value));
    }

    public static toUnixTimeMS(value: string): UnixTimeMS {
        return Date.parse(value);
    }

    public static toISODate(input: ISODateTimeString): ISODateString {
        return input.substring(0, '0000-00-00'.length);
    }

    public static toISOYear(input: ISODateTimeString): ISODateString {
        return input.substring(0, '0000'.length);
    }

    public static compare(a: ISODateTimeString, b: ISODateTimeString): number {
        return this.parse(a).getTime() - this.parse(b).getTime();
    }

}

