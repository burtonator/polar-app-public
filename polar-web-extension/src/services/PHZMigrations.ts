import {PHZMigrationClient} from "polar-web-extension-api/src/PHZMigrationClient";
import {IDStr} from "polar-shared/src/util/Strings";
import {PersistenceLayer} from "polar-bookshelf/web/js/datastore/PersistenceLayer";
import {DocMetas} from "polar-bookshelf/web/js/metadata/DocMetas";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

export namespace PHZMigrations {

    import IStartPHZMigrationMessage = PHZMigrationClient.IStartPHZMigrationMessage;

    export function setActiveMigration(migration: IStartPHZMigrationMessage) {
        localStorage.setItem('phz-migration', JSON.stringify(migration));
    }

    export function getActiveMigration(): IStartPHZMigrationMessage | undefined {

        const data = localStorage.getItem('phz-migration');

        if (!data) {
            return undefined;
        }

        return JSON.parse(data);

    }

    function copyKeys<T>(src: T, dest: T, keys: ReadonlyArray<keyof T>) {
        for (const key of keys) {
            dest[key] = src[key];
        }
    }

    export async function doMigration(docID: IDStr,
                                      migration: IStartPHZMigrationMessage,
                                      persistenceLayer: PersistenceLayer) {

        const newDocMeta = await persistenceLayer.getDocMeta(docID);
        const existingDocMeta = await persistenceLayer.getDocMeta(migration.docID);

        if (! newDocMeta) {
            console.warn("Migration failed. No newDocMeta for ID.");
            return;
        }

        if (! existingDocMeta) {
            console.warn("Migration failed. No existingDocMeta");
            return;
        }

        copyKeys(existingDocMeta.docInfo, newDocMeta.docInfo, [
            'title',
            'archived',
            'flagged',
            'description',
            'publisher',
            'doi',
            'pmid',
            'readingPerDay',
            'visibility',
            'authors',
            'summary',
            'nrTextHighlights',
            'nrFlashcards',
            'nrNotes',
            'nrComments',
            'tags'
        ]);

        const newPageMeta = DocMetas.getPageMeta(newDocMeta, 1);
        const existingPageMeta = DocMetas.getPageMeta(existingDocMeta, 1);

        Dictionaries.putAll(existingPageMeta.textHighlights, newPageMeta.textHighlights);
        Dictionaries.putAll(existingPageMeta.comments, newPageMeta.comments);
        Dictionaries.putAll(existingPageMeta.flashcards, newPageMeta.flashcards);

        await persistenceLayer.writeDocMeta(newDocMeta);

    }

}
