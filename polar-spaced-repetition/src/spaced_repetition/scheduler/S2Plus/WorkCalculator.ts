import {IDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {ISpacedRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {DurationMS, TimeDurations} from "polar-shared/src/util/TimeDurations";
import {AsyncWorkQueue} from "polar-shared/src/util/AsyncWorkQueue";
import {Arrays} from "polar-shared/src/util/Arrays";
import ts from "typescript/lib/tsserverlibrary";
import convertCompilerOptions = ts.server.convertCompilerOptions;
import {Learning} from "./Learning";

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

        workReps.filter(current => current.age > 0)
                .sort((a, b) => b.age - a.age);

        return Arrays.head(workReps, opts.limit);

    }

}

/**
 * Return a WorkRep if we were able to find it or undefined.
 */
export type OptionalWorkRepResolver = (work: Work) => Promise<WorkRep | undefined>;

/**
 * Return a WorkRep or a default rep if we're unable to find it.
 */
export type WorkRepResolver = (work: Work) => Promise<WorkRep>;

/**
 * If we don't have an explicit state, then we need to compute a new one...
 *
 * @param work
 * @param delegate
 */
export async function defaultWorkRepResolver(work: Work, delegate: OptionalWorkRepResolver): Promise<WorkRep> {

    const result = await delegate(work);

    if (result) {
        return result;
    }

    const intervals = Learning.intervals('reading');
    const interval = intervals[0];
    const intervalMS = TimeDurations.toMillis(interval);

    const created = ISODateTimeStrings.parse(work.created);

    const age = Date.now() - (created.getTime() + intervalMS);

    return {
        ...work,
        age,
        stage: "learning",
        state: {
            reviewedAt: work.created,
            interval,
        }
    }

}

export interface CalculateOpts {

    readonly potential: ReadonlyArray<Work>;

    /**
     * Given a unit of work, resolved the space rep metadata.
     */
    readonly resolver: WorkRepResolver;

    /**
     * The limit of the number of tasks to return.
     */
    readonly limit: number;

}


export interface Work {

    readonly id: IDStr;

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
