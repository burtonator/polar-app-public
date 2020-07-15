/**
 * A general service interface that allows us to submit something to be uploaded.
 */
import {DataURLStr, IDStr} from "polar-shared/src/util/Strings";
import {Progress} from "polar-shared/src/util/ProgressTracker";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export interface ICacheEntry<K> {
    readonly key: K;
    readonly dataURL: string;
}

export interface ICacheEntryWithValue<K, V> {
    readonly key: K;
    readonly dataURL: string;
    readonly value: V;
}

export interface ISubmittedUpload {
    readonly dataURL: string;
}

/**
 * Handles submitting URLs to be uploaded but also computing existing data
 * that's in the local cache and hasn't been uploaded yet.
 *
 * This is needed for Google cloud storage as there is no transparent upload
 * service.  This is probably NOT a good idea for use within PDFs but works just
 * fine with smaller URLs like PNGs that are less than about 1MB.  The data is
 * eventually removed from IndexedDB and the permanent URL is used, not the
 * temp URL.
 */
export interface IBackgroundUploaderService<K, V> {

    /**
     * Get a cache entry that is in the store.  Will return undefined if the key
     * is not present.
     */
    readonly get: (key: K) => ICacheEntry<K> | undefined;

    /**
     * Submit a URL into the uploader service to be uploaded and cached locally
     * until it's available.
     */
    readonly submit: (key: K,
                      value: V,
                      progressListener: ProgressListener) => ISubmittedUpload;

}

export type ProgressListener = (progress: Progress) => void;

/**
 * The implementation of the progress loader to use with the service.
 */
export type IBackgroundUploader<K, V> = (key: K, value: V, progressListener: ProgressListener) => void;

/**
 * Take a specific value type, which we would need to upload, and convert it to
 * a DataURL.
 */
export type DataURLFactory<V> = (value: V) => DataURLStr;

/**
 * A function to convert a key to a unique string so we can represent it in
 * localStorage as a unique key.
 */
export type KeyToStr<K> = (key: K) => string;

/**
 * Convert a cache entry BACK into a value so we can resume if the computer
 * comes back online.
 */
export type CacheEntryToValue<K, V> = (cacheEntry: ICacheEntry<K>) => V;

namespace CacheEntries {

    export function toJSON<K>(cacheEntry: ICacheEntry<K>): string {
        return JSON.stringify(cacheEntry);
    }

    export function fromJSON<K>(str: string): ICacheEntry<K> {
        return JSON.parse(str);
    }

}

function registerResumeHandler(resumeHandler: () => void) {

    window.addEventListener('online', () => {
        resumeHandler();
    })

    window.addEventListener('offline', () => {

    })

}

export namespace BackgroundUploaders {

    const LOCALSTORAGE_PREFIX = 'background-uploader:';

    export interface ICreateOpts<K, V> {

        /**
         * The ID of this uploader so that we can have multiple uploaders
         * working with different backend types and implementations.
         */
        readonly id: IDStr;

        readonly dataURLFactory: DataURLFactory<V>

        readonly keyToStr: KeyToStr<K>;

        readonly cacheEntryToValue: CacheEntryToValue<K, V>;

        readonly backgroundUploader: IBackgroundUploader<K, V>;

    }

    export function create<K, V>(opts: ICreateOpts<K, V>): IBackgroundUploaderService<K, V> {

        // FIXME: implement resume...

        const {id, keyToStr, dataURLFactory, backgroundUploader, cacheEntryToValue} = opts;

        function toLocalStorageKey(key: K) {

            const keyStr = keyToStr(key);

            return `${LOCALSTORAGE_PREFIX}:${id}:${keyStr}`;
        }

        function get(key: K): ICacheEntry<K> | undefined {

            const localStorageKey = toLocalStorageKey(key);

            const localStorageValue = localStorage.getItem(localStorageKey);

            function toCacheEntry(value: string): ICacheEntry<K> {
                return JSON.parse(value);
            }

            if (localStorageValue) {
                return toCacheEntry(localStorageValue);
            } else {
                return undefined;
            }

        }

        function submit(key: K, value: V, progressListener: ProgressListener): ISubmittedUpload {

            const dataURL = dataURLFactory(value);

            function writeToLocalStorage() {

                function toCacheEntry(): ICacheEntry<K> {
                    return {
                        key, dataURL
                    };
                }

                function toCacheJSON() {
                    return CacheEntries.toJSON(toCacheEntry());
                }

                const localStorageKey = toLocalStorageKey(key);
                localStorage.setItem(localStorageKey, toCacheJSON());

            }

            function submitToBackend() {

                // FIXME: write the resume entry...
                // FIXME: the CacheEntry should be able to allow us to resume
                // by computing the original value from the dataURL.

                backgroundUploader(key, value, progressListener);

            }

            writeToLocalStorage();
            submitToBackend();

            return {dataURL};

        }

        /**
         * Resume uploading data after disconnect.
         */
        function doResume() {

            function computeLocalStorageKeys(): ReadonlyArray<IDStr> {
                const prefix = `${LOCALSTORAGE_PREFIX}:${id}:`;
                return Object.keys(localStorage).filter(key => key.startsWith(prefix));
            }

            function computePendingCacheEntries() {

                function toCacheEntryWithValue(cacheEntry: ICacheEntry<K>): ICacheEntryWithValue<K, V> {

                    const value = cacheEntryToValue(cacheEntry);

                    return {
                        ...cacheEntry,
                        value
                    };

                }

                function parseCacheEntry(str: string): ICacheEntry<K> {
                    return CacheEntries.fromJSON(str);
                }

                const localStorageKeys = computeLocalStorageKeys();

                return localStorageKeys.map(localStorage.getItem)
                                       .filter(current => current !== null)
                                       .map(current => current!)
                                       .map(parseCacheEntry)
                                       .map(toCacheEntryWithValue);

            }

            const pendingCacheEntries = computePendingCacheEntries();

            // FIXME: listen to navigator.onLine to auto-resume here.
            //
            // FIXME: figure out a way to reliably ABORT uploads that are
            // currently running so that they don't resume if we come back
            // online and then have TWO uploads happening in parallel.

            // FIXME: investigate the issues with getting callbacks when the
            // snapshot fails...

            // FIXME: if we have MULTIPLE windows created/uploaded it's possible
            // to have multiple resumes happening...

            // FIXME: how do I log that resume is happening?  Creating snackbars
            // seems like a bit silly...

            // FIXME: to only have ONE lock per browser instance I need some
            // type of mutex lock but mayb eI could mutex lock each key for a
            // given time.

            // FIXME: just ALWAYS do one URL at a time... if it fails, add it
            // to the back of the queue.. don't attempt to upload from the queue
            // if navigator.onLine is false

            // FIXME: ALWAYS have URLs go through the queue

            for(const pendingCacheEntry of pendingCacheEntries) {
                submit(pendingCacheEntry.key, pendingCacheEntry.value, NULL_FUNCTION);
            }

        }

        return {get, submit};

    }

}
