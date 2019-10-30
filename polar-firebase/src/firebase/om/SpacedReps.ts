import {IDStr} from "polar-shared/src/util/Strings";
import {CollectionNameStr, Collections, FirestoreProvider, UserIDStr} from "../Collections";

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

}

/**
 * Represent the spaced repetition history and state for a card.
 */
export interface SpacedRep {

    /**
     * The ID if the key we're working with.
     */
    readonly id: IDStr;

    /**
     * The user ID / owner of this card.
     */
    readonly uid: UserIDStr;

    /**
     * True when the card is suspended and no longer available for review.
     */
    readonly suspended?: boolean;

    // FIXME: I need to add this back in in the future but I don't like 'reading' as the item.  
//    readonly itemType:

    // readonly state:

}

export type ItemType = 'flashcard' | 'reading';
