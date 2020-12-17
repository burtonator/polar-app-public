import {Optional} from "polar-shared/src/util/ts/Optional";
import {DocImporter} from "polar-bookshelf/web/js/apps/repository/importers/DocImporter";
import {WriteFileProgressListener} from "polar-bookshelf/web/js/datastore/Datastore";
import {PersistenceLayer} from "polar-bookshelf/web/js/datastore/PersistenceLayer";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export namespace DatastoreWriter {

    import IDocImport = DocImporter.IDocImport;
    import DocImporterOpts = DocImporter.DocImporterOpts;

    export interface IWriteOpts {

        readonly persistenceLayer: PersistenceLayer;

        readonly doc: Blob,
        readonly type: 'pdf' | 'epub';
        readonly url: string;
        readonly basename: string;
        readonly title?: string;
        readonly description?: string;

        readonly fingerprint?: string;
        readonly nrPages?: number;

        readonly progressListener: WriteFileProgressListener;

        readonly webCapture: boolean;

    }

    export interface WrittenDoc {
        readonly id: string;
    }

    export async function write(opts: IWriteOpts): Promise<WrittenDoc> {

        const {persistenceLayer} = opts;

        const persistenceLayerProvider = () => persistenceLayer;

        const title = Optional.of(opts.title).getOrElse("Untitled");
        const description = Optional.of(opts.description).getOrElse("");

        // TODO ... Rong... pass the author
        const docInfo: Partial<IDocInfo> = {
            title,
            description,
            url: opts.url,
            bytes: opts.doc.size,
            webCapture: opts.webCapture
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
                    webCapture: opts.webCapture
                }

            }

            return undefined;

        }

        const docImport = createDocImport();

        const docImporterOpts: DocImporterOpts = {
            docInfo,
            docImport,
            consistency: 'committed',
            progressListener: opts.progressListener
        }

        const imported = await DocImporter.importFile(persistenceLayerProvider,
                                                      url,
                                                      opts.basename,
                                                      docImporterOpts);

        return {id: imported.docInfo.fingerprint};

    }

}







