import { IDocCache, IDocCacheEntry, CacheURLFactory, DocCachesFactory } from "./DocCaches";
import { IDocInfo } from "polar-shared/src/metadata/IDocInfo";
import { PagemarkType } from "polar-shared/src/metadata/PagemarkType";
import { Backend } from "polar-shared/src/datastore/Backend";
import { BackendFileRef } from "polar-shared/src/datastore/BackendFileRef";
import { IDStr } from "polar-shared/src/util/Strings";

function createBlobData(length: number): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
        result += characters;
    }
    return result;
}

async function measurePut(iDocCache : IDocCache, entry: IDocCacheEntry): Promise<number> {
    const start = new Date().getTime();

    await iDocCache.put(entry)

    let elapsed = new Date().getTime() - start;
    console.log('put time: ' + elapsed + 'ms')
    return elapsed
}

async function measureGet(iDocCache : IDocCache, id: IDStr): Promise<number> {
    const start = new Date().getTime();

    await iDocCache.get(id)

    let elapsed = new Date().getTime() - start;
    console.log('get time: ' + elapsed + 'ms')
    return elapsed
}

describe('DocCaches', function () {

    it("basic", async function () {
        this.timeout(10000)

        const blobData : string = createBlobData(1700000)

        const blob = new Blob([JSON.stringify(blobData, null, 2)], {type : 'application/json'});

        // convert blob size to Kilobytes
        const blobSize : number = blob.size / 1024
        console.log('blob size is: ' + blobSize + 'KB')
        
        const backend : Backend = Backend.PUBLIC
        const fileRef : BackendFileRef = {name: 'fileRefname', backend}
        const docInfo : IDocInfo = {
            nrPages: 10,
            fingerprint: 'test-fingerprint',
            progress: 5,
            pagemarkType: PagemarkType.SINGLE_COLUMN,
            properties: {
                'property1': 'value1'
            },
            archived: false,
            flagged: false,
            attachments: {
                'attachment1': {fileRef}
            }
        }
        const iDocEntry : IDocCacheEntry = {id: 'test1', docInfo, docType: 'string', docURL: 'url', docBlob: blob }

        const cacheURLFactory : CacheURLFactory = (str : string) => 'cacheURLFactoryTest2-' + str
        const iDocCache : IDocCache = DocCachesFactory.create(cacheURLFactory)

        for (let i = 0; i < 5; i++) {
            console.log('iteration ' + i)
            await measurePut(iDocCache, iDocEntry);
            await measureGet(iDocCache, iDocEntry.id);
            console.log()
        }

    });
});
