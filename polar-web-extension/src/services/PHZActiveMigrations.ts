import {PHZMigrationClient} from "polar-web-extension-api/src/PHZMigrationClient";

export namespace PHZActiveMigrations {

    import IStartPHZMigrationMessage = PHZMigrationClient.IStartPHZMigrationMessage;

    export function set(migration: IStartPHZMigrationMessage) {
        localStorage.setItem('phz-migration', JSON.stringify(migration));
    }

    export function clear() {
        localStorage.removeItem('phz-migration');
    }

    export function get(): IStartPHZMigrationMessage | undefined {

        const data = localStorage.getItem('phz-migration');

        if (!data) {
            return undefined;
        }

        return JSON.parse(data);

    }


}
