import {DateLike, Days} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Duration, DurationStr, TimeDurations} from "polar-shared/src/util/TimeDurations";

const milliPerDay = 1000 * 60 * 60 * 24;

export class Dates {

    public static addDays(dateA: DateLike, numDays: number): Date {
        const date = new Date(dateA);
        date.setTime(date.getTime() + daysToMillis(numDays));
        return date;
    }

    public static subtractDays(dateA: DateLike, numDays: number): Date {
        const date = new Date(dateA);
        date.setTime(date.getTime() - daysToMillis(numDays));
        return date;
    }

    public static diffDays = (dateA: Date, dateB: Date): Days => {
        const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
        const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

        return Math.floor((utc1 - utc2) / milliPerDay);
    };

    public static toDays(duration: Duration) {
        return TimeDurations.toMillis(duration) / milliPerDay;
    }

}

export function daysToMillis(numDays: number) {
    return numDays * milliPerDay;
}

