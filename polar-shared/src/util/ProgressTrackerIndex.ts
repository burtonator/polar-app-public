import {Progress} from "./ProgressTracker";
import {isPresent} from '../Preconditions';
import {Optional} from "./ts/Optional";
import {Arrays} from "./Arrays";

export class ProgressTrackerIndex {

    private index: { [key: number]: Progress } = {};

    public update(progress: Progress) {

        if (! isPresent(progress.progress)) {
            return;
        }

        if (progress.progress === 100) {
            delete this.index[progress.task];
        } else {
            this.index[progress.task] = progress;
        }

    }

    public min(defaultValue: number = 100): Optional<Progress> {

        if (Object.keys(this.index).length === 0) {
            // no entries so we're done.
            return Optional.empty();

        }

        const values = Object.values(this.index)
                             .sort((a, b) => a.progress - b.progress);

        return Optional.of(Arrays.first(values));

    }

}


