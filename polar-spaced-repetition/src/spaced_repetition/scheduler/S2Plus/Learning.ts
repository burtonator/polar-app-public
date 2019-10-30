import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {DurationStr} from "polar-shared/src/util/TimeDurations";

export class Learning {

    public static intervals(mode: RepetitionMode): ReadonlyArray<DurationStr> {

        switch (mode) {

            case "flashcard":
                return ['10m', '1h', '4h'];

            case "reading":
                return ['1d', '4d', '8d'];

        }

    }

}

