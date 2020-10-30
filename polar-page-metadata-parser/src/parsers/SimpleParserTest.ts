import {ConstructorOptions, JSDOM} from "jsdom";
import {SimpleParser} from "./SimpleParser";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('SimpleParser', function() {

    function parseHTML(html: string, url: string) {

        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM(html, opts);
        return dom.window.document;

    }

    it("basic", function() {

        const doc = parseHTML(`<html><body><div class="title">this is the title</div></body>`, 'http://example.com');
        const parser = new SimpleParser();
        const metadata = parser.parse(doc);
        assertJSON(metadata, {
            "pdfURL": "http://example.com/example.pdf",
            "title": "this is the title",
            "url": "http://example.com/"
        });

    });

});
