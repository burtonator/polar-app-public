
import timekeeper from 'timekeeper';
import {DurationMS, DurationStr, TimeDurations} from '../util/TimeDurations';
import {Dates} from "../util/Dates";
import {ISODateTimeString} from "../metadata/ISODateTimeStrings";

const epoch = new Date(1330688329321);

export class TestingTime {

    /**
     * Freeze time for testing at '2012-03-02T11:38:49.321Z'
     */
    public static freeze(date: Date | ISODateTimeString = epoch) {

        date = Dates.toDate(date);

        timekeeper.reset();
        timekeeper.freeze(date);
    }

    public static unfreeze() {
        timekeeper.reset();
    }

    public static forward(duration: DurationMS | DurationStr) {
        timekeeper.freeze(new Date(Date.now() + this.toDurationMS(duration)));
    }

    private static toDurationMS(duration: DurationMS | DurationStr) {

        if (typeof duration === 'string') {
            return TimeDurations.toMillis(duration);
        } else {
            return duration;
        }

    }

}

export function freeze() {
    TestingTime.freeze();
}

