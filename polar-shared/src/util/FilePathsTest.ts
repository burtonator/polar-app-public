import {assert} from 'chai';
import {BrowserFilePaths, FilePaths} from './FilePaths';
import {Files} from './Files';
import {Platforms} from "./Platforms";

describe('FilePaths', function() {


    describe('hasExtension', function() {

        it("basic", function() {
            assert.isTrue(FilePaths.hasExtension('foo.pdf', 'pdf'));
            assert.isTrue(FilePaths.hasExtension('foo.PDF', 'pdf'));
            assert.isTrue(FilePaths.hasExtension('foo.pdf', 'PDF'));
            assert.isTrue(FilePaths.hasExtension('foo.PDF', 'PDF'));
            assert.isTrue(FilePaths.hasExtension('foo.pdf', '.pdf'));
            assert.isTrue(FilePaths.hasExtension('foo.PDF', '.pdf'));
        });

    });

    describe('BrowserFilePaths', function() {

        it("basename", function() {

            const assertEqual = (path: string, ext?: string) => {
                const actual = FilePaths.basename(path, ext);
                const expected = BrowserFilePaths.basename(path, ext);
                assert.equal(actual, expected);
            };

            assertEqual('/foo/cat.txt', '.txt');

            assertEqual('cat.txt', '.txt');

            assertEqual('none');
            assertEqual('/foo/bar.txt');
            assertEqual('/foo/cat.txt');
            assertEqual('/bar.txt');

            BrowserFilePaths.SEP = '\\';

            assert.equal(BrowserFilePaths.basename('c:\\foo\\cat.txt', '.txt'), 'cat');
            assert.equal(BrowserFilePaths.basename('none'), 'none');

            assert.equal(BrowserFilePaths.basename('c:\\foo\\bar.txt'), 'bar.txt');

        });

    });

    xdescribe('toWindowsPath', () => {

        it("basic", async function() {

            assert.equal(FilePaths.toWindowsPath('/tmp/test/hello.txt'), 'C:\\tmp\\test\\hello.txt');

        });

    });

    xdescribe('textToWindowsPath', () => {

        // TODO: these caused bugs on MacOS...

        it("basic", async function() {

            assert.equal(FilePaths.textToWindowsPath('some text /tmp/test/hello.txt then this'), 'some text C:\\tmp\\test\\hello.txt then this');

        });

        it("real world", async function() {

            const text = '     at Function.getCaller (/home/burton/projects/polar-bookshelf/web/js/test/MyTest.jsx:5:17)';
            const expected = '     at Function.getCaller (C:\\home\\burton\\projects\\polar-bookshelf\\web\\js\\test\\MyTest.jsx:5:17)';

            assert.equal(FilePaths.textToWindowsPath(text), expected);

        });

    });

    describe('toExtension', function() {

        it('null and undefined', function() {
            assert.equal(FilePaths.toExtension(null!).isPresent(), false);
            assert.equal(FilePaths.toExtension(undefined!).isPresent(), false);
        });

        it('empty string', function() {
            assert.equal(FilePaths.toExtension("").isPresent(), false);
        });

        it('None', function() {
            assert.equal(FilePaths.toExtension("hello").isPresent(), false);
        });

        it('Basic', function() {
            assert.equal(FilePaths.toExtension("hello.txt").get(), "txt");
        });

        it('Four chars', function() {
            assert.equal(FilePaths.toExtension("hello.html").get(), "html");
        });

    });

    xdescribe('File URLs', async function() {

        // xit('Test file URL', async function() {
        //
        //     const path = FilePaths.createTempName('file-url-data.txt');
        //
        //     const data = 'hello world';
        //     await Files.writeFileAsync(path, data);
        //
        //     const url = FilePaths.toURL(path);
        //
        //     console.log("URL: " + url);
        //
        //     const response = await fetch(url);
        //
        //     const buffer = await response.buffer();
        //
        //     assert.ok(isPresent(buffer), "no buffer");
        //     assert.equal(data, buffer.toString('utf8'));
        //
        // });

    });

    describe('toURL', async function() {

        it('spaces and special chars but still valid.', async function() {

            const assertPathExists = async (path: string) => {
                assert.ok(await Files.existsAsync(path), "Path does not exist: " + path);
            };

            const special = "This is a special name UPPER, (17) [test 10.11] -- foo (1)";

            const dir = FilePaths.resolve(FilePaths.tmpdir(), special);
            const path = FilePaths.resolve(dir, special + ".pdf");

            await Files.removeDirectoryRecursivelyAsync(dir);

            await Files.mkdirAsync(dir);
            await Files.writeFileAsync(path, "fake data");

            await assertPathExists(path);

            const url = FilePaths.toURL(path);

            console.log("Encoded URL is: " + url);

            const decodedPath = FilePaths.fromURL(url);

            console.log("Decoded path is: " + decodedPath);

            // make sure the input path is the same as the decoded path.
            assert.equal(path, decodedPath);

            await assertPathExists(FilePaths.dirname(FilePaths.dirname(decodedPath)));
            await assertPathExists(FilePaths.dirname(decodedPath));
            await assertPathExists(decodedPath);

        });

        it('with hash', function() {

            const makePlatformSpecificPath = (path: string) => {

                if (process.platform === 'win32') {
                    return path.replace('file:///tmp/', 'file:///C:/tmp/');
                }

                return path;

            };

            assert.equal(FilePaths.toURL("/tmp/Test #1/chubby.pdf"),
                         makePlatformSpecificPath('file:///tmp/Test%20%231/chubby.pdf'));

            assert.equal(FilePaths.toURL("/tmp/Test ?1/chubby.pdf"),
                         makePlatformSpecificPath('file:///tmp/Test%20%3F1/chubby.pdf'));

        });

    });

});
