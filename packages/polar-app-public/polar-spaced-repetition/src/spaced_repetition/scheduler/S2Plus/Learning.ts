import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {DurationStr} from "polar-shared/src/util/TimeDurations";
import {Preconditions} from "polar-shared/src/Preconditions";


export class Learning {

    public static DEFAULT_GRADUATING_DIFFICULTY = 0.3;

    public static DEFAULT_GRADUATING_INTERVAL = '16d';

    public static intervals(mode: RepetitionMode): ReadonlyArray<DurationStr> {

        Preconditions.assertPresent(mode, 'mode');

        switch (mode) {

            case "flashcard":
                return ['10m', '1h', '4h'];

            case "reading":
                return ['1d', '4d', '8d'];

            default:
                throw new Error("Unknown repetition mode: " + mode);

        }

    }

}

