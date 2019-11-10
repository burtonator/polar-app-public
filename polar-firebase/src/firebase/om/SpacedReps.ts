import {IDStr} from "polar-shared/src/util/Strings";
import {Clause, CollectionNameStr, Collections, FirestoreProvider, UserIDStr} from "../Collections";
import {ISpacedRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

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
        const collections = this.collections();
        await collections.set(id, spacedRep);
    }

    public static async get(id: IDStr): Promise<SpacedRep | undefined> {
        const collections = this.collections();
        return await collections.get(id);
    }

    public static async list(uid: UserIDStr): Promise<ReadonlyArray<SpacedRep>> {
        const collections = this.collections();
        const clauses: ReadonlyArray<Clause> = [['uid', '==', uid]];
        return await collections.list(clauses);
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
