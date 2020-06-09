import {EPUBGenerator} from "./EPUBGenerator";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Files} from "polar-shared/src/util/Files";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";

describe('EPUBGenerator', function() {

    it("basic", async function() {

        const doc: EPUBGenerator.EPUBDocument = {
            url: 'http://www.example.com',
            title: 'Hello World',
            conversion: ISODateTimeStrings.create(),
            contents: [
                {
                    id: 'index.html',
                    href: 'index.html',
                    mediaType: 'text/html',
                    title: 'Hello World',
                    data: '<html><body>hello</body></html>',
                    images: []
                }
            ]
        }

        const epub = await EPUBGenerator.generate(doc);
        await Files.writeFileAsync('/tmp/test-epub.epub', ArrayBuffers.toBuffer(epub));

    });
});
