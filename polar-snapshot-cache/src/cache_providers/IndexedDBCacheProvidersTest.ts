import {assert} from 'chai';
import { IndexedDBCacheProviders } from './IndexedDBCacheProviders';
import {ICachedDoc} from "../ICachedDoc";
import {Numbers} from "polar-shared/src/util/Numbers";

describe('IndexedDBCacheProviders', function() {

    this.timeout(10000);

    it("create", async function() {
        console.log("Creating IndexedDB cache provider")
        const cacheProvider = IndexedDBCacheProviders.create()

        await cacheProvider.writeDoc('0x001', {
            id: '0x001',
            exists: true,
            data: {
                hello: true
            }
        });

    });

    describe('benchmarks', () => {


        function createRecord(count: number): ReadonlyArray<ICachedDoc> {

            function toCachedDoc(idx: number): ICachedDoc {

                return {
                    id: `${idx}`,
                    exists: true,
                    data: {
                        value: idx
                    }
                };
            }

            return Numbers.range(1, count).map(toCachedDoc)

        }

        async function doBenchmark(delegate: () => Promise<void>) {

            const before = Date.now();

            await delegate();

            const after = Date.now();
            const duration = after - before;
            console.log(`Duration: ${duration}ms`);

        }


        // NOTES:
        //
        // on my machine it takes about 25ms to write one doc to IndexedDB or
        // 2500ms for 100 docs.
        //
        // setMulti takes 37ms which is far far far faster so I think we should ALWAYS do setMulti basically.
        //
        //
        // Basically any operation takes about 25ms so if, with a snapshot, I can write everything at once
        // then we should be set and save about 25ms from the query.
        //
        // We would write the docs, plus the index.

        // RAW benchmark output:
        //
        // 100 records
        //
        // individual writeDoc: 2500ms
        // writeDocs: 37ms                   (67x faster)
        // individual readDoc: 42ms
        // readDocs: 5ms                     (8x faster)

        it("Individual writeDoc records ", async function() {

            console.log("Creating IndexedDB cache provider")
            const cacheProvider = IndexedDBCacheProviders.create()

            await cacheProvider.purge();

            const records = createRecord(100);

            console.log("Testing individual... ")

            await doBenchmark(async () => {

                for (const record of records) {
                    await cacheProvider.writeDoc(record.id, record);
                }

            })

        });

        it("Multiple writeDoc records ", async function() {

            console.log("Creating IndexedDB cache provider")
            const cacheProvider = IndexedDBCacheProviders.create()

            await cacheProvider.purge();

            const records = createRecord(100);

            console.log("Testing multiple writeDoc records... ")

            await doBenchmark(async () => {

                await cacheProvider.writeDocs(records.map(current => [current.id, current]));

            })

        });



        it("Individual readDoc requests ", async function() {

            console.log("Creating IndexedDB cache provider")
            const cacheProvider = IndexedDBCacheProviders.create()

            await cacheProvider.purge();

            const records = createRecord(100);

            console.log("Testing individual readDoc requests... ")

            await cacheProvider.writeDocs(records.map(current => [current.id, current]));

            await doBenchmark(async () => {

                for (const record of records) {
                    const result = await cacheProvider.readDoc(record.id);
                    if (result === undefined) {
                        throw new Error("Benchmark failed to read value");
                    }
                }

            })

        });


        it("Individual readDoc requests ", async function() {

            console.log("Creating IndexedDB cache provider")
            const cacheProvider = IndexedDBCacheProviders.create()

            await cacheProvider.purge();

            const records = createRecord(100);

            console.log("Testing readDocs... ")

            await cacheProvider.writeDocs(records.map(current => [current.id, current]));

            await doBenchmark(async () => {
                const result = await cacheProvider.readDocs(records.map(current => current.id));

                if (result.length !== records.length) {
                    throw new Error("Unable to read all records");
                }

            })

        });
    });

});
