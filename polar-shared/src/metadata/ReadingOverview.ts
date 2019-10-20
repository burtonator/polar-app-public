import {ISODateTimeString} from './ISODateTimeStrings';

export interface ReadingOverview {
    [timestamp: string /* ISODateTimeString */]: number;
}

/**
 * Stats for that specific timestamp.
 */
export interface ReadingStats {
    readonly nrPages: number;
}


