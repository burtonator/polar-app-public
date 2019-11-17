import {ISODateTimeString, ISODateTimeStrings} from '../metadata/ISODateTimeStrings';
import {Preconditions} from '../Preconditions';

export class TimeDurations {

    // TODO: it would be nice to specify 1d1m2s too...
    public static toMillis(duration: Duration): DurationMS {

        Preconditions.assertPresent(duration, 'duration');
        if (duration === '') {
            throw new Error("Can not parse empty string to millis");
        }

        if (typeof duration === 'number') {
            // we're done as this is already a number.
            return duration;
        }

        const sign = duration.startsWith('-') ? -1 : 1;

        duration = duration.replace(/^-/, "");

        const val = parseInt(duration.replace(/[smhw]/g, ""), 10);

        // TODO: I don't think we handle 1m30s right now.

        // TODO: would be nice to only accept a limited vocabulary so I could have
        // type checking work. I could take the durations as varargs like

        // '1m', '30s' and sum them.

        if (duration.endsWith("w")) {
            return sign * val * 7 * 24 * 60 * 60 * 1000;
        } else if (duration.endsWith("d")) {
            return sign * val * 24 * 60 * 60 * 1000;
        } else if (duration.endsWith("h")) {
            return sign * val * 60 * 60 * 1000;
        } else if (duration.endsWith("m")) {
            return sign * val * 60 * 1000;
        } else if (duration.endsWith("ms")) {
            return sign * val;
        } else if (duration.endsWith("s")) {
            return sign * val * 1000;
        } else {
            throw new Error(`Unable to parse duration: ${duration}`);
        }

    }

    /**
     * Compute a new date by taking the duration and applying it to the date and then computing a new Date.
     */
    public static compute(duration: Duration, date: Date = new Date()): Date {
        return new Date(date.getTime() + TimeDurations.toMillis(duration));
    }

    public static format(duration: Duration): DurationStr {

        type TimeComponent = 'd' | 'h' | 'm' | 's' | 'ms';

        interface TimeValue {
            readonly component: TimeComponent;
            readonly value: number;
        }

        const removePrefix = (timeValues: ReadonlyArray<TimeValue>) => {

            let isPrefix = true;

            return timeValues.filter( timeValue => {

                if (! isPrefix) {
                    return true;
                }

                if (timeValue.value > 0) {
                    isPrefix = false;
                    return true;
                }

                return false;

            });

        };

        /**
         * Format the list of times such that zero values are emitted.
         *
         * For example a duration of '1d' should just emit as '1d' not
         * 1d0h0m0s0ms this way the formatting is concise.
         */
        const formatConcise = (timeValues: ReadonlyArray<TimeValue>) => {

            return timeValues.filter(timeValue => timeValue.value !== 0)
                .map(timeValue => timeValue.value + timeValue.component)
                .join('');

        };

        const durationMS = this.toMillis(duration);

        // create the time since epoch and the hour/minute/seconds/ms can work
        // directly.
        const date = new Date(durationMS);

        const days = Math.floor(durationMS / DURATION_1D);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const milliseconds = date.getUTCMilliseconds();

        const timeValues: ReadonlyArray<TimeValue> = [
            {value: days, component: 'd'},
            {value: hours, component: 'h'},
            {value: minutes, component: 'm'},
            {value: seconds, component: 's'},
            {value: milliseconds, component: 'ms'},
        ];

        const noPrefixTimeValues = removePrefix(timeValues);

        return formatConcise(noPrefixTimeValues);

    }

    /**
     * Format to a concise time like 4w, 4.5w, etc.  Do not do more detailed formatting like 4m2d as this isn't
     * very user friendly.
     *
     * @param duration
     */
    public static formatConcise(duration: Duration) {

        //
        // const durationMS = this.toMillis(duration);
        //
        // // year / month, week, day, hour.. what about confusing with minute and month???
        //
        // if (durationMS > 24 * 60 * 60 * 1000;

    }

    /**
     * Compute a random duration based on the given duration.
     * @param duration
     */
    public static toRandom(duration: Duration): DurationMS {

        const durationMS = this.toMillis(duration);

        return Math.random() * durationMS;

    }

    /**
     * Return true if the amount of time in the given duration has elapsed
     * since the given date.
     *
     *
     * @param since
     * @param duration
     * @param now The current time.
     */
    public static hasElapsed(since: Date | ISODateTimeString, duration: Duration, now: Date = new Date()) {

        since = this.toDate(since);

        const durationMS = this.toMillis(duration);

        const nowMS = now.getTime();

        const cutoffMS = since.getTime() + durationMS;

        return (nowMS > cutoffMS);

    }

    public static inWeeks(since: Date | ISODateTimeString, now: Date = new Date()) {

        since = this.toDate(since);

        Preconditions.assert(since, value => value instanceof Date, "since not Date");

        const delta = now.getTime() - since.getTime();

        const nrWeeks = Math.floor(delta / this.toMillis('1w'));

        return `${nrWeeks}w`;

    }

    private static toDate(date: Date | ISODateTimeString): Date {

        if (typeof date === 'string') {
            return ISODateTimeStrings.parse(date);
        }

        return date;

    }

}

/**
 * A duration in milliseconds
 */
export type DurationMS = number;

/**
 * A time duration string which has the following supported suffixes:
 *
 * ms = milliseconds
 * s = seconds
 * m = minutes
 * h = hours
 * d = days
 * w = weeks
 */
export type DurationStr = string;

/**
 * A duration in either a string form or just raw MS.
 */
export type Duration = DurationStr | DurationMS;

const DURATION_1D: DurationMS = TimeDurations.toMillis('1d');
const DURATION_1H: DurationMS = TimeDurations.toMillis('1h');
const DURATION_1M: DurationMS = TimeDurations.toMillis('1m');
const DURATION_1S: DurationMS = TimeDurations.toMillis('1s');
