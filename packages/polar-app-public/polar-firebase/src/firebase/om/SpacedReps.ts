import {IDStr} from "polar-shared/src/util/Strings";
import {Clause, CollectionNameStr, Collections, FirestoreProvider, UserIDStr} from "../Collections";
import {ISpacedRep, TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Preconditions} from "polar-shared/src/Preconditions";

/**
 * Main class storing spaced repetition for flashcards, annotations, etc.  This stores the
 * state of the card so that next time we want to access it we can just fetch it
 * directly.
 */
export class SpacedReps {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "spaced_rep";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static async set(id: IDStr, spacedRep: SpacedRep) {
        Preconditions.assertPresent(id, 'id');
        const collections = this.collections();
        await collections.set(id, spacedRep);
    }

    public static async get(id: IDStr): Promise<SpacedRep | undefined> {
        Preconditions.assertPresent(id, 'id');
        const collections = this.collections();
        return await collections.get(id);
    }

    public static async list(uid: UserIDStr): Promise<ReadonlyArray<SpacedRep>> {
        Preconditions.assertPresent(uid, 'uid');
        const collections = this.collections();
        const clauses: ReadonlyArray<Clause> = [['uid', '==', uid]];
        return await collections.list(clauses);
    }

    public static convertFromTaskRep(uid: UserIDStr, taskRep: TaskRep<any>): SpacedRep {

        return {
            uid,
            id: taskRep.id,
            suspended: taskRep.suspended,
            lapses: taskRep.lapses,
            stage: taskRep.stage,
            state: taskRep.state
        };

    }

}

/**
 * Represent the spaced repetition state for a card.
 */
export interface SpacedRep extends ISpacedRep {

    /**
     * The user ID / owner of this card.
     */
    readonly uid: UserIDStr;

}
