import {Days, RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

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

