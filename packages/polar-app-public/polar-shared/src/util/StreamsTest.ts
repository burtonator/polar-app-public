import {assert} from 'chai';
import {Files} from "./Files";
import {FilePaths} from "./FilePaths";
import {LineSplitter, Streams} from "./Streams";
import {Strings} from "./Strings";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Buffers} from "./Buffers";
import {Latch} from "./Latch";

describe('StreamsTest', function() {

    it("Basic", async function() {

        let path = FilePaths.createTempName('stream-progress.txt');

        const data = Strings.generate(65536 * 3);

        await Files.writeFileAsync(path, data);

        const stat = await Files.statAsync(path);

        const stream = await Files.createReadStream(path);

        let init = {id: 'test', total: stat.size};

        const callbacks: number[] = [];

        const progressStream = await Streams.toProgressStream(stream, init, (progress) => {
            callbacks.push(progress.completed);
        });

        assertJSON(callbacks, []);

        await Streams.toBuffer(progressStream);

        assertJSON(callbacks, [
            0,
            65536,
            131072,
            196608
        ]);

    });


    it("toLines", async function() {

        const buff = new Buffer("hello\nworld\n");
        const stream = Buffers.toStream(buff);

        const lines: string[] = [];

        const onLine = (line: string) => {
            lines.push(line);
        };

        const latch = new Latch();

        const onCompletion = (err?: Error) => {

            if  (err) {
                latch.reject(err)
            } else {
                latch.resolve(null);
            }

        };

        Streams.toLines({stream}, onLine, onCompletion);

        await latch.get();

        assertJSON(lines, ['hello', 'world']);

    });

    describe("LineSplitter", async function() {

        it("basic 1", async function() {

            const latch = new Latch();

            const lineSplitter = new LineSplitter(line => {
                latch.resolve(line);
            });

            lineSplitter.onData("hello\nworld");

            const line = await latch.get();

            assert.equal(line, 'hello');

        });


        it("remaining data", async function() {

            const lines: string[] = [];

            const lineSplitter = new LineSplitter(line => {
                lines.push(line);
            });

            lineSplitter.onData("hello\nworld");

            lineSplitter.close();

            assertJSON(lines, ['hello', 'world']);

        });

        it("multiple lines", async function() {

            const lines: string[] = [];

            const lineSplitter = new LineSplitter(line => {
                lines.push(line);
            });

            lineSplitter.onData("multi\nlines\nin\none\nchunk\n");

            lineSplitter.close();

            assertJSON(lines, ['multi', 'lines', 'in', 'one', 'chunk']);

        });

        it("between two chunks", async function() {

            const lines: string[] = [];

            const lineSplitter = new LineSplitter(line => {
                lines.push(line);
            });

            lineSplitter.onData("two ");
            lineSplitter.onData("chunks");

            lineSplitter.close();

            assertJSON(lines, ['two chunks']);

        });

        it("multiple lines, empty lines, etc.", async function() {

            const lines: string[] = [];

            const lineSplitter = new LineSplitter(line => {
                lines.push(line);
            });

            lineSplitter.onData("hello");
            lineSplitter.onData(" world\n");
            lineSplitter.onData("");
            lineSplitter.onData("");
            lineSplitter.onData("line 1\n");
            lineSplitter.onData("multi\nlines\nin\none\nchunk\n");
            lineSplitter.onData("trailing ");
            lineSplitter.onData("data");


            lineSplitter.close();

            assertJSON(lines, [
                "hello world",
                "line 1",
                "multi",
                "lines",
                "in",
                "one",
                "chunk",
                "trailing data"
            ]);

        });

    });


});
