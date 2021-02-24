import {ConstructorOptions, JSDOM} from "jsdom";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Fetches } from "polar-shared/src/util/Fetch";
import { ACMParser } from './ACMParser';
import {assertJSON} from "polar-test/src/test/Assertions";

async function readTestData(url: string): Promise<string> {

    if (existsSync('test/acm1.html')) {
        console.log('The path exists.');
        return readFileSync('test/acm1.html').toString()
    } else {
        const response = await Fetches.fetch(url);

        const html = await response.text();
        writeFileSync('test/acm1.html', html)
        return html;
    }

}

describe('ACMParser', function () {

    function parseHTML(html: string, url: string) {
        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM(html, opts);
        return dom.window.document;
    }

    it("basic", async function () {

        // TODO: we will have to use JSDOM to create a DOM within nodejs to parse the HTML
        //
        // TODO: we should probably save HTML in polar-page-metadata-parser/src/test/arxiv1.html
        // which will hold test1 and you can use Files to open the test , parse it with JSDOM,
        // and then you'll have a document object that you can use to test the parser with.
        // this uses the *same* DOM API that's used in the browser so your code will work there
        // too

        //
        // const url = "https://arxiv.org/abs/2010.09039";
        //
        // const parser = Parsers.get(url);
        //

        const url = "https://dl.acm.org/doi/10.1145/2043155.2043156";
        const html = await readTestData(url);

        const doc = parseHTML(html, url);
        const parser = new ACMParser();
        const metadata = parser.parse(doc)
        //console.log(metadata)
        assertJSON(metadata, {
          title: 'The 7% rule',
          doi: 'https://doi.org/10.1145/2043155.2043156',
          abstract: 'In 1971, Albert Mehrabian published a book Silent Messages, in which he discussed his research on non-verbal communication. He concluded that prospects based their assessments of credibility on fac...',
          authors: [ 'Philip Yaffe', 'Philip Yaffe' ],
          url: 'https://dl.acm.org/doi/10.1145/2043155.2043156',
          pdfURL: 'https://dl.acm.org/doi/pdf/10.1145/2043155.2043156',
          date: '2011-10-01',
          description: 'In 1971, Albert Mehrabian published a book Silent Messages, in which he discussed his research on non-verbal communication. He concluded that prospects based their assessments of credibility on fac...',
          publisher: 'ACM'
        });
    });

});