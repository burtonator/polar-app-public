import {IDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {ISpacedRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {DurationMS} from "polar-shared/src/util/TimeDurations";
import {AsyncWorkQueue} from "polar-shared/src/util/AsyncWorkQueue";
import {Arrays} from "polar-shared/src/util/Arrays";

export class WorkCalculator {

    /**
     * Take potential work and use data from the backend to prioritize it for the user.
     */
    public static async calculate(opts: CalculateOpts): Promise<ReadonlyArray<WorkRep>> {

        const workReps: WorkRep[] = [];

        const jobs = opts.potential.map((current) => async () => {
            const workRep = await opts.resolver(current);
            workReps.push(workRep);
        });

        const asyncWorkQueue = new AsyncWorkQueue(jobs);

        await asyncWorkQueue.execute();

        // FIXME: implement a provider that can see if if we have now ISpacedRep data and then returns default
        // values for this so that we use the default interval.

        workReps.filter(current => current.age > 0)
                .sort((a, b) => b.age - a.age);

        return Arrays.head(workReps, opts.limit);

    }

}

export interface CalculateOpts {

    readonly potential: ReadonlyArray<Work>;

    /**
     * Given a unit of work, resolved the space rep metadata.
     */
    readonly resolver: (ref: WorkRef) => Promise<WorkRep>;

    /**
     * The limit of the number of tasks to return.
     */
    readonly limit: number;

}


export interface WorkRef {
    readonly id: IDStr;
}

export interface Work extends WorkRef {

    readonly text: string;

    /**
     * The time the items was first created. This is used to compute the initial age.
     */
    readonly created: ISODateTimeString;

    readonly color: HighlightColor;

}

export interface WorkRep extends ISpacedRep, Work {

    /**
     * The age of the work so we can sort the priority queue.
     */
    readonly age: DurationMS;

}
