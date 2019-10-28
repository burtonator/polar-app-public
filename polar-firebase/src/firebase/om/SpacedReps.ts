/**
 * Main class storing spaced repetition for flashcards, annotations, etc.
 */
import {IDStr} from "polar-shared/src/util/Strings";
import {CollectionNameStr, Collections, FirestoreProvider, UserIDStr} from "../Collections";

export class SpacedReps {

    private static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "spaced_rep";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static set(id: IDStr, spacedRep: SpacedRep) {

        // const collections =

    }

}

/**
 * Represent the spaced repetition history and state for a card.
 */
export interface SpacedRep {

    /**
     *
     */
    readonly id: IDStr;

    /**
     * The user ID / owner of this card.
     */
    readonly uid: UserIDStr;

}