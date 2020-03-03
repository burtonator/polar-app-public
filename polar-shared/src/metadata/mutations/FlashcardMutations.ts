import {IDocMeta} from "../IDocMeta";
import {IFlashcard} from "../IFlashcard";
import {IFlashcardMap, IPageMeta} from "../IPageMeta";

export type FlashcardsCallback = (pageMeta: IPageMeta, flashcards: IFlashcardMap) => boolean;

export class FlashcardMutations {

    public static update(docMeta: IDocMeta, flashcard: IFlashcard): boolean {

        return this.forEachPageMeta(docMeta, (pageMeta, flashcards) => {

            if (flashcards[flashcard.id]) {
                flashcards[flashcard.id] = flashcard;
                return true;
            }

            return false;

        });

    }

    public static delete(docMeta: IDocMeta, flashcard: IFlashcard): boolean {

        return this.forEachPageMeta(docMeta, (pageMeta, flashcards) => {

            if (flashcards[flashcard.id]) {
                delete flashcards[flashcard.id];
                return true;
            }

            return false;

        });

    }

    private static forEachPageMeta(docMeta: IDocMeta, callback: FlashcardsCallback): boolean {

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const flashcards = pageMeta.flashcards || {};

            if (callback(pageMeta, flashcards)) {
                return true;
            }

        }

        return false;

    }

}
