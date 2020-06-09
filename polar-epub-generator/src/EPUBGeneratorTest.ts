import {EPUBGenerator} from "./EPUBGenerator";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Files} from "polar-shared/src/util/Files";
import {ArrayBuffers} from "polar-shared/src/util/ArrayBuffers";

describe('EPUBGenerator', function() {

    it("basic", async function() {

        const data = `<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Test</title>
</head>
<body>
<p>hello</p>
</body>
</html>`;

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
