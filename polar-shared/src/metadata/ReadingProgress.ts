import {ISODateTimeString} from './ISODateTimeStrings';

export interface ReadingProgress {

    readonly id: string;

    /**
     * The time time this was created.
     */
    readonly created: ISODateTimeString;

    /**
     * The reading progress / percentag completed for the current page.
     */
    readonly progress: number;

    readonly progressByMode: ProgressByMode;

    /**
     * This is a roll-up of a 'pre-existing' pagemark and shouldn't be counted
     * towards the daily limits only for the delta.  
     */
    readonly preExisting?: boolean;

}

export interface ProgressByMode {
    [id: string]: number;
}

