import {assert} from 'chai';
import {Callers} from './Callers';
import {FilePaths} from '../util/FilePaths';

describe('Callers', function() {

    describe('Test basic caller', () => {

        it("call method and to make sure we get the right caller", async function() {


            const actual = myCaller();
            actual.filename = actual.filename.replace(/\.(js|ts)/, '.js');

            assert.deepEqual(actual, { filename: "CallerTest.js" });

        });

        // (C:\\Users\\admin\\polar-bookshelf\\web\\js\\logger\\CallerTest.js

    });

    describe('__parse', () => {

        it("Parse a basic frame", async function() {

            const frame = "     at Function.getCaller (/home/burton/projects/polar-bookshelf/web/js/test/MyTest.js:5:17)";

            assert.deepEqual(Callers._parse(frame), { filename: "MyTest.js" });
            assert.deepEqual(Callers._parse(FilePaths.textToWindowsPath(frame)), { filename: "MyTest.js" });

        });


        it("Parse a webpack frame", async function() {
            const frame = "    at Object../web/js/metadata/Pagemarks.js (http://127.0.0.1:8500/web/dist/electron-bundle.js:59471:86)\n";
            assert.deepEqual(Callers._parse(frame), { filename: "Pagemarks.js" });
            assert.deepEqual(Callers._parse(FilePaths.textToWindowsPath(frame)), { filename: "Pagemarks.js" });
        });


        it("Parse a webpack frame with a question mark at the end", async function() {
            const frame = "    at eval (webpack:///./web/js/metadata/Pagemarks.js?:11:86)\n";
            assert.deepEqual(Callers._parse(frame), { filename: "Pagemarks.js" });
            assert.deepEqual(Callers._parse(FilePaths.textToWindowsPath(frame)), { filename: "Pagemarks.js" });
        });

        //

        it("Parse from web worker", async function () {
            const frame = '    at file:///home/burton/projects/polar-bookshelf/web/js/datastore/dispatcher/PersistenceLayerWorker.js:12:29';
            assert.deepEqual(Callers._parse(frame), { filename: "PersistenceLayerWorker.js" });
            assert.deepEqual(Callers._parse(FilePaths.textToWindowsPath(frame)), { filename: "PersistenceLayerWorker.js" });
        });

    });

});

function myCaller() {
    // should return "myCaller"
    return Callers.getCaller();
}
