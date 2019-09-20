import {Optional} from "polar-shared/src/util/ts/Optional";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {StorageSettings} from "../datastore/StorageSettings";
import {StoragePath} from "../datastore/StoragePath";
import {URLStr} from "polar-shared/src/util/Strings";
import { Backend } from "../datastore/Backend";
import {LiteralOrProvider, Providers} from "polar-shared/src/util/Providers";

export class FirebaseFileStorage {

    public static getURL(backend: Backend,
                         fileRef: FileRef,
                         uid: string /* UserIDStr */): URLStr {

        const storagePath = this.computeStoragePath(backend, fileRef, uid);

        return this.computeDownloadURLDirectly(backend, fileRef, storagePath);

    }

    private static computeStorageSettings(optionalExt: Optional<string>): Optional<StorageSettings> {

        const PUBLIC_MAX_AGE_1WEEK = 'public,max-age=604800';

        const ext = optionalExt.getOrElse('').toLowerCase();

        if (ext === 'jpg' || ext === 'jpeg') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/jpeg'
            });

        }

        if (ext === 'pdf') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'application/pdf'
            });

        }

        if (ext === 'png') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/png'
            });

        }

        if (ext === 'svg') {

            return Optional.of({
                cacheControl: PUBLIC_MAX_AGE_1WEEK,
                contentType: 'image/svg'
            });

        }

        // the fall through of cached data should work for PHZ files and other
        // types of binary data.

        return Optional.of({
            cacheControl: PUBLIC_MAX_AGE_1WEEK,
            contentType: 'application/octet-stream'
        });

    }

    public static computeStoragePath(backend: Backend,
                                     fileRef: FileRef,
                                     uid: string /* UserIDStr */): StoragePath {

        const ext = FilePaths.toExtension(fileRef.name);

        const suffix = ext.map(value => {

            if ( ! value.startsWith('.') ) {
                // if the suffix doesn't begin with a '.' then add it.
                value = '.' + value;
            }

            return value;

        }).getOrElse('');

        const settings = this.computeStorageSettings(ext).getOrUndefined();

        let key: any;

        if (fileRef.hashcode) {

            key = {

                // We include the uid of the user to avoid the issue of user
                // conflicting on files and the ability to share them per file.
                // The cloud storage costs for raw binary files are
                // inconsequential so have one file per user.

                uid,
                backend,
                alg: fileRef.hashcode.alg,
                enc: fileRef.hashcode.enc,
                data: fileRef.hashcode.data,
                suffix

            };

        } else {

            // Build a unique name from the filename and the UUID of the user.
            // this shouldn't actually be used except in the cases of VERY old
            // datastores.
            //
            key = {
                uid,
                filename: fileRef.name
            };

        }

        const id = Hashcodes.createID(key, 40);

        const path = `${backend}/${id}${suffix}`;

        return {path, settings};

    }

    public static computeDownloadURLDirectly(backend: Backend,
                                             ref: FileRef,
                                             storagePath?:  StoragePath): URLStr {

        /**
         * Compute the storage path including the flip over whether we're
         * going to be public without any type of path conversion depending
         * on whether it's public or not.  Public URLs have a 1:1 mapping
         * where everything else might be in a different bucket or path
         * depending the storage computation function.
         */
        const toPath = (): string => {

            if (backend === Backend.PUBLIC || backend === Backend.CACHE) {
                // there is no blinding of the data path with the users
                // user ID or other key.
                return `${backend}/${ref.name}`;
            } else if (storagePath) {
                return storagePath.path;
            } else {
                throw new Error("No storagePath");
            }

        };

        const toURL = (): string => {

            const path = toPath();

            const project = process.env.POLAR_TEST_PROJECT || "polar-32b0f";

            return `https://storage.googleapis.com/${project}.appspot.com/${path}`;

        };

        return toURL();

    }

}
