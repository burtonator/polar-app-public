import {Days} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export class Learning {

    public static intervals(mode: RepetitionMode): ReadonlyArray<Days> {

        switch (mode) {

            case "flashcard":
                return [1, 2, 4];

            case "reading":
                return [1, 4, 8];

        }

    }

}

/**
 * The type of repetition mode we're in.  Either flashcard or reading mode.  Reading tends to be more involved so we
 * have different intervals for this mode.
 */
export type RepetitionMode = 'flashcard' | 'reading';
