import {Blobs} from './Blobs';

xdescribe('Blobs', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("basic", async function() {

        const blob = new Blob(["asdf"], {type : 'text/plain'});

        const arrayBuffer = await Blobs.toArrayBuffer(blob);

        Buffer.from(arrayBuffer);

    });

});
