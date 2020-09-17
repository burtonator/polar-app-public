import {Datastores} from "polar-bookshelf/web/js/datastore/Datastores";
import {Directories} from "../../../polar-bookshelf/web/js/datastore/Directories";
import { Files } from "polar-shared/src/util/Files";

declare var global: any;

export namespace LegacyDatastores {

    async function hasLegacyData() {
        const directories = new Directories();
        return await Files.existsAsync(directories.dataDir);
    }

    async function createDatastore() {
        const datastore = Datastores.create();
        await datastore.init();
        return datastore;
    }

    export async function start() {

        if (! await hasLegacyData()) {
            // only start if the main directory is present, otherwise do not
            // init the legacy datastore.
            return;
        }

        console.log("Started legacy datastore for import into modern Polar 2.0");

        // set this global so that we can read it from within Electron via
        // the remote datastore.
        global.datastore = await createDatastore();

    }

}
