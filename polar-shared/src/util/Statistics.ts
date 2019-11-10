import {ISODateString, ISODateTimeStrings} from "../metadata/ISODateTimeStrings";
import {ArrayListMultimap} from "./Multimap";

export interface DataPoint {
    readonly created: ISODateString;
}

/**
 * Used so that we can take the times with maybe multiple recordings at the same time and elide them.
 */
export interface TimeReducer {
    (timestamp: ISODateString): ISODateString;
}


export interface DataPointsReducer<A extends DataPoint> {
    (timestamp: ISODateString, datapoints: ReadonlyArray<A>): A;
}

export class Statistics {

    public static compute<A extends DataPoint>(dataPoints: Iterable<A>,
                                               dataPointsReducer: DataPointsReducer<A>,
                                               timeReducer: TimeReducer = ISODateTimeStrings.toISODateStringRoundedToHour): ReadonlyArray<A> {

        const multimap = new ArrayListMultimap<ISODateString, A>();

        for (const dataPoint of dataPoints) {
            const created = timeReducer(dataPoint.created);
            multimap.put(created, dataPoint);
        }

        return multimap.keys()
                       .map(key => dataPointsReducer(key, multimap.get(key)));


    }

}
