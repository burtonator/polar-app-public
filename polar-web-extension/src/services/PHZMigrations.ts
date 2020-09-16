import {PHZMigrationClient} from "polar-web-extension-api/src/PHZMigrationClient";
import {IDStr} from "polar-shared/src/util/Strings";
import {PersistenceLayer} from "polar-bookshelf/web/js/datastore/PersistenceLayer";
import { IDocInfo } from "polar-shared/src/metadata/IDocInfo";

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

    function copyKeys<T>(dest: T, src: T, keys: ReadonlyArray<keyof T>) {
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

        copyKeys(newDocMeta.docInfo, existingDocMeta.docInfo, [
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
            'summary'
        ]);

        // copy text highlights now...

    }

}
