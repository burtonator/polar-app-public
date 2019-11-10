import {IDStr} from "polar-shared/src/util/Strings";
import {Clause, CollectionNameStr, Collections, FirestoreProvider, UserIDStr} from "../Collections";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

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
                              spacedRepStat: SpacedRepStat) {

        const id = Hashcodes.createRandomID();

        const spacedRepStatRecord: SpacedRepStatRecord = {
            id, uid,
            ...spacedRepStat
        };

        const collections = this.collections();
        await collections.set(id, spacedRepStatRecord);

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

}

/**
 * Number of cards in a given stage.
 */
export interface StageCounts {

    /**
     * The number of cards in learning stage.
     */
    readonly nrLearning: number;

    /**
     * The number of cards in review stage.
     */
    readonly nrReview: number;

    /**
     * The number of cards in lapsed stage.
     */
    readonly nrLapsed: number;

}

/**
 * A basic stat must have a mode.
 */
export interface IStat {
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

}

export type SpacedRepStat = QueueStat | CompletedStat;

export type SpacedRepStatRecord = SpacedRepStat & ISpacedRepStatRecord;
