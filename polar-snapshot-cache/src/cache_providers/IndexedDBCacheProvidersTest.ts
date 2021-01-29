import {assert} from 'chai';
import { IndexedDBCacheProviders } from './IndexedDBCacheProviders';

describe('IndexedDBCacheProviders', function() {

    it("create", function() {
        console.log("Creating IndexedDB cache provider")
        IndexedDBCacheProviders.create();
    });

});
