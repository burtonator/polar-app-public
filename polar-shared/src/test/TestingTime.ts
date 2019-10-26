
import timekeeper from 'timekeeper';
import {DurationMS, DurationStr, TimeDurations} from '../util/TimeDurations';

const epoch = new Date(1330688329321);

export class TestingTime {

    /**
     * Freeze time for testing at '2012-03-02T11:38:49.321Z'
     */
    public static freeze(time: Date = epoch) {
        timekeeper.reset();
        timekeeper.freeze(time);
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

