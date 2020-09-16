import {PHZMigrationClient} from "polar-web-extension-api/src/PHZMigrationClient";

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

}
