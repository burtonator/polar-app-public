import {assert} from 'chai';
import {Files} from "./Files";
import {FilePaths} from "./FilePaths";
import {LineSplitter, Streams} from "./Streams";
import {Strings} from "./Strings";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Buffers} from "./Buffers";
import {Latch} from "./Latch";
import {Reducers} from "./Reducers";

describe('StreamsTest', function() {

    it("Basic", async function() {

        const path = FilePaths.createTempName('stream-progress.txt');

        const len = 65536 * 3;

        const data = Strings.generate(len);

        await Files.writeFileAsync(path, data);

        const stat = await Files.statAsync(path);
        assert.equal(stat.size, len);

        const stream = await Files.createReadStream(path);

        const init = {id: 'test', total: stat.size};

        const callbacks: number[] = [];

        const progressStream = await Streams.toProgressStream(stream, init, (progress) => {
            console.log("completed: ", progress.completed);
            callbacks.push(progress.completed);
        });

        assertJSON(callbacks, []);

        const buff = await Streams.toBuffer(progressStream);
        assert.equal(buff.toString('utf-8'), data, 'Buffers are not the same');

        // await Streams.toBuffer(progressStream);

        console.log("Testing callbacks length");
        assert.equal(callbacks.reduce(Reducers.MAX), len, "callback sum is not correct");

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
                latch.reject(err);
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
