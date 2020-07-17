import {ISODateString, ISODateTimeString, ISODateTimeStrings} from "../metadata/ISODateTimeStrings";
import {ArrayListMultimap} from "./Multimap";
import {Arrays} from "./Arrays";

export interface DataPoint {
    readonly created: ISODateString;
}

/**
 * Used so that we can take the times with maybe multiple recordings at the same time and elide them.
 */
export type TimeReducer = (timestamp: ISODateString) => ISODateString;

export type DataPointsReducer<A extends DataPoint> = (timestamp: ISODateString, datapoints: ReadonlyArray<A>) => A;

export type EntryDatapointFactory<A> = (key: ISODateTimeString) => A;

export class Statistics {

    public static compute<A extends DataPoint>(dataPoints: Iterable<A>,
                                               dataPointsReducer: DataPointsReducer<A>,
                                               emptyDatapointFactory: EntryDatapointFactory<A> | undefined,
                                               timeReducer: TimeReducer = ISODateTimeStrings.toISODateStringRoundedToHour): ReadonlyArray<A> {

        const multimap = new ArrayListMultimap<ISODateString, A>();

        for (const dataPoint of dataPoints) {
            const created = timeReducer(dataPoint.created);
            multimap.put(created, dataPoint);
        }

        const keys = [...multimap.keys()].sort();

        const reduced = keys.map(key => dataPointsReducer(key, multimap.get(key)));

        // with the reduced data, we need to add ZERO values for days we don't have any values.

        // if (emptyDatapointFactory) {
        //
        //     const result = [
        //         ...reduced,
        //         emptyDatapointFactory(ISODateTimeStrings.create())
        //     ]
        //
        //     return result;
        //
        // } else {
        //     return reduced;
        // }

        return reduced;

    }

}
