import {FirebaseDatastore} from "polar-bookshelf/web/js/datastore/FirebaseDatastore";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {DefaultPersistenceLayer} from "polar-bookshelf/web/js/datastore/DefaultPersistenceLayer";
import {Firestore} from "polar-bookshelf/web/js/firebase/Firestore";
import {DocInfo} from "polar-bookshelf/web/js/metadata/DocInfo";
import {DocImporter} from "polar-bookshelf/web/js/apps/repository/importers/DocImporter";

export namespace DatastoreWriter {

    import IDocImport = DocImporter.IDocImport;

    export interface IWriteOpts {
        readonly doc: Blob,
        readonly type: 'pdf' | 'epub';
        readonly url: string;
        readonly basename: string;
        readonly title?: string;
        readonly description?: string;

        readonly fingerprint?: string;
        readonly nrPages?: number;
    }

    export interface WrittenDoc {
        readonly id: string;
    }

    export async function write(opts: IWriteOpts): Promise<WrittenDoc> {

        await Firestore.init({enablePersistence: false});

        const datastore = new FirebaseDatastore()
        // TODO add back in the error listener I think.
        await datastore.init(NULL_FUNCTION, {noInitialSnapshot: true, noSync: true});
        const persistenceLayer = new DefaultPersistenceLayer(datastore);
        const persistenceLayerProvider = () => persistenceLayer;

        const title = Optional.of(opts.title).getOrElse("Untitled");
        const description = Optional.of(opts.description).getOrElse("");

        const docInfo: Partial<DocInfo> = {
            title,
            description,
            url: opts.url

        }

        const url = URL.createObjectURL(opts.doc);

        function createDocImport(): IDocImport | undefined {

            if (opts.fingerprint !== undefined &&
                opts.nrPages !== undefined) {

                return {
                    fingerprint: opts.fingerprint,
                    nrPages: opts.nrPages,
                    title,
                    description,
                }

            }

            return undefined;

        }

        const docImport = createDocImport();

        const imported = await DocImporter.importFile(persistenceLayerProvider,
                                                      url,
                                                      opts.basename,
                                                      {docInfo, docImport});

        await persistenceLayer.stop();

        return {id: imported.docInfo.fingerprint};

    }

}







