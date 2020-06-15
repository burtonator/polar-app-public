import {FirebaseDatastore} from "polar-bookshelf/web/js/datastore/FirebaseDatastore";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Backend} from "polar-shared/src/datastore/Backend";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {DocMetas} from "polar-bookshelf/web/js/metadata/DocMetas";
import {BackendFileRefData} from "polar-bookshelf/web/js/datastore/Datastore";
import {Optional} from "polar-shared/src/util/ts/Optional";
import {DefaultPersistenceLayer} from "polar-bookshelf/web/js/datastore/DefaultPersistenceLayer";
import {Firestore} from "polar-bookshelf/web/js/firebase/Firestore";

export namespace DatastoreWriter {

    export interface IWriteOpts {
        readonly epub: ArrayBuffer,
        readonly title: string;
        readonly description: string;
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

        const fingerprint = Hashcodes.createRandomID();
        const filename = Hashcodes.createRandomID() + '.epub'
        const hashcode = Hashcodes.createHashcode(opts.epub);

        const docMeta = DocMetas.create(fingerprint, 1, filename);

        docMeta.docInfo.title = Optional.of(opts.title)
                                        .getOrElse("Untitled");

        docMeta.docInfo.description = opts.description;
        docMeta.docInfo.hashcode = hashcode;

        const fileRef: FileRef = {
            name: filename,
            hashcode
        }
        const blob = ArrayBuffers.toBlob(opts.epub);

        const writeFile: BackendFileRefData = {
            backend: Backend.STASH,
            data: blob,
            ...fileRef
        };

        await persistenceLayer.write(fingerprint, docMeta, {writeFile});
        await persistenceLayer.stop();

        return {id: fingerprint};


    }

}







