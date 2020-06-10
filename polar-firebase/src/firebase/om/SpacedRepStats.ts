import {IDStr} from "polar-shared/src/util/Strings";
import {Clause, CollectionNameStr, Collections, FirestoreProvider, UserIDStr} from "../Collections";
import {RepetitionMode, StageCounts} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

/**
 * Stores card stats for a user each time they compute a new queue so that we can keep track
 * of things over time and show the user stats regarding much work they have left.
 */
export class SpacedRepStats {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "spaced_rep_stat";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    /**
     * Write a new stat to the database.
     */
    public static async write(uid: UserIDStr,
                              spacedRepStat: SpacedRepStat): Promise<SpacedRepStatRecord> {

        const id = Hashcodes.createRandomID();

        const spacedRepStatRecord: SpacedRepStatRecord = {
            id, uid,
            ...spacedRepStat,
            created: ISODateTimeStrings.create(),
        };

        const collections = this.collections();
        await collections.set(id, spacedRepStatRecord);

        return spacedRepStatRecord;
    }

    /**
     * Get the most recent stats for for the given mode.
     */
    public static async list(uid: UserIDStr,
                             mode: RepetitionMode,
                             type: StatType): Promise<ReadonlyArray<SpacedRepStatRecord>> {

        const collections = this.collections();

        const clauses: ReadonlyArray<Clause> = [
            ['uid', '==', uid],
            ['mode', '==', mode],
            ['type', '==', type]
        ];

        return await collections.list(clauses);

    }

    /**
     * Return true if this user has stats.
     */
    public static async hasStats(uid: UserIDStr): Promise<boolean> {

        const collections = this.collections();

        const clauses: ReadonlyArray<Clause> = [
            ['uid', '==', uid],
        ];

        const result = await collections.list(clauses, {limit: 1});
        return result.length > 0;

    }

}


/**
 * A basic stat must have a mode.
 */
export interface IStat {
    readonly created: ISODateTimeString;
    readonly mode: RepetitionMode;
}

export type StatType = 'queue' | 'completed';

/**
 * Stats on the queue of items computed to the user has some understanding of how much work they have left.
 */
export interface QueueStat extends IStat, StageCounts {
    readonly type: 'queue';
}

export interface CompletedStat extends IStat, StageCounts {
    readonly type: 'completed';
}

export interface ISpacedRepStatRecord {

    readonly id: IDStr;

    /**
     * The user ID / owner of this card.
     */
    readonly uid: UserIDStr;

    /**
     * The time this stat was recorded.
     */
    readonly created: ISODateTimeString;

}

export type SpacedRepStat = QueueStat | CompletedStat;

export type SpacedRepStatRecord = SpacedRepStat & ISpacedRepStatRecord;
