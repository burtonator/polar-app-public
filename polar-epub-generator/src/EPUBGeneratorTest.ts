import {EPUBGenerator} from "./EPUBGenerator";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Files} from "polar-shared/src/util/Files";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";
import {XHTMLWrapper} from "./XHTMLWrapper";

describe('EPUBGenerator', function() {

    it("basic", async function() {

        const opts = {
            title: 'This is the title',
            content: '<p>hello</p>'
        }

        const data = XHTMLWrapper.wrap(opts);

        const doc: EPUBGenerator.EPUBDocument = {
            url: 'http://www.example.com',
            title: 'Hello World',
            conversion: ISODateTimeStrings.create(),
            contents: [
                {
                    id: 'index.html',
                    href: 'index.html',
                    mediaType: 'application/xhtml+xml',
                    title: 'Hello World',
                    data,
                    images: []
                }
            ]
        }

        const epub = await EPUBGenerator.generate(doc);
        await Files.writeFileAsync('/tmp/test-epub.epub', ArrayBuffers.toBuffer(epub));

    });
});
