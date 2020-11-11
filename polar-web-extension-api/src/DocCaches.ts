import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";

export interface IDocCacheDescriptor {

    /**
     * The ID for this precached data.
     */
    readonly id: IDStr;

    /**
     * The docInfo that we're going to import into the datastore.
     */
    readonly docInfo: IDocInfo;

    readonly docType: 'application/pdf' | string;

    /**
     * The URL that we stored into the cache
     */
    readonly docURL: URLStr;

}

export interface IDocCacheEntry extends IDocCacheDescriptor {

    readonly docBlob: Blob;

}

export interface IDocCache {
    put(entry: IDocCacheEntry): Promise<void>;
    get(id: IDStr): Promise<IDocCacheEntry | undefined>;
}

// TODO: this isn't all the metadata we need as we need to figure out a way to
// compute the cache URL with data from Firestore

export type CacheURLFactory = (id: IDStr) => string;

/**
 * Maintains a cache in two places.  One is for the DocInfo and that's in
 * LocalStorage and the other
 */
export namespace DocCachesFactory {

    export function create(createCacheURL: CacheURLFactory): IDocCache {

        function computeCacheKey(id: IDStr) {
            return 'doc-cache:' + id;
        }

        async function put(entry: IDocCacheEntry) {

            function putDocInfo() {

                const cacheKey = computeCacheKey(entry.id)

                const descriptor: IDocCacheDescriptor = {
                    id: entry.id,
                    docInfo: entry.docInfo,
                    docType: entry.docType,
                    docURL: entry.docURL
                }

                localStorage.setItem(cacheKey, JSON.stringify(descriptor));

            }

            async function putDoc() {

                // TODO: additional headers we might need:

                // content-disposition: inline; filename*=utf-8''1PwtutApP6pbC1SszLuEzjBpU8V14EZDAnUfGmPN.pdf
                // date: Sun, 08 Nov 2020 01:12:51 GMT
                // etag: "019dc567a6789590d93ff145684ddaf1"
                // expires: Sun, 15 Nov 2020 01:12:51 GMT
                // last-modified: Wed, 30 Sep 2020 17:10:22 GMT
                // server: UploadServer
                // status: 200

                const cache = await caches.open('polar-doc-cache');

                const cacheURL = createCacheURL(entry.id);
                const response = new Response(entry.docBlob, {
                    headers: {
                        'Accept-Ranges': 'bytes',
                        'Access-Control-Allow-Origin': '*',
                        'Content-Length': `${entry.docBlob.size}`,
                        'Vary': 'Origin',
                        'Content-Type': entry.docType,
                        'Cache-Control': 'public,max-age=604800',
                        'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range, Content-Type, Date, Range, Server, Transfer-Encoding, X-GUploader-UploadID, X-Google-Trace'
                    },
                    status: 200
                });

                const request = new Request(cacheURL);

                await cache.put(request, response);

            }

            putDocInfo();
            await putDoc()

        }

        async function get(id: IDStr): Promise<IDocCacheEntry | undefined> {

            const cacheKey = computeCacheKey(id)
            const cacheURL = createCacheURL(id);

            function getDocCacheDescriptor(): IDocCacheDescriptor | undefined {

                try {
                    const value = localStorage.getItem(cacheKey);

                    if (value === null) {
                        return undefined;
                    }

                    return JSON.parse(value)

                } catch(e) {
                    console.error(e);
                    return undefined;
                }

            }

            async function getDocBlob(): Promise<Blob | undefined> {

                if (!await caches.has('polar-doc-cache')) {
                    console.error('cache does not exist')
                    return undefined
                }
                const cache = await caches.open('polar-doc-cache');
                const response = await cache.match(new Request(cacheURL));
                if (response !== undefined) {
                    return response.blob()
                }
                return undefined;
            }

            const docCacheDescriptor = await getDocCacheDescriptor();

            if (! docCacheDescriptor) {
                return undefined;
            }
            const docBlob = await getDocBlob();
            if (! docBlob) {
                return undefined;
            }

            return {
                ...docCacheDescriptor,
                docBlob,
            }

        }

        return {get, put};

    }

}