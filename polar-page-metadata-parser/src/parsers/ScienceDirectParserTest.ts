import {ConstructorOptions, JSDOM} from "jsdom";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Fetches } from "polar-shared/src/util/Fetch";
import { ScienceDirectParser } from './ScienceDirectParser';
import {assertJSON} from "polar-test/src/test/Assertions";

async function readTestData(url: string): Promise<string> {

    if (existsSync('test/sciencedirect1.html')) {
        console.log('The path exists.');
        return readFileSync('test/sciencedirect1.html').toString()
    } else {
        const response = await Fetches.fetch(url);

        const html = await response.text();
        writeFileSync('test/sciencedirect1.html', html)
        return html;
    }

}

describe('ScienceDirectParser', function () {

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

        const url = "https://www.sciencedirect.com/science/article/pii/S221450951630047X";
        const html = await readTestData(url);

        const doc = parseHTML(html, url);
        const parser = new ScienceDirectParser();
        const metadata = parser.parse(doc)
        //console.log(metadata)
        assertJSON(metadata, {
            title: 'Performance assessment of natural pozzolan roller compacted concrete pavements',
            doi: 'https://doi.org/10.1016/j.cscm.2017.03.004',
            abstract: 'Concrete pavement is cost effective and beneficial because of its sustainability and durability. The maintenance and renovation periods for such pavem…',
            authors: [ 'S.A. Ghahari', 'A. Mohammadi', 'A.A. Ramezanianpour' ],
            url: 'https://www.sciencedirect.com/science/article/pii/S221450951630047X',
            date: '2017/12/01',
            description: 'Concrete pavement is cost effective and beneficial because of its sustainability and durability. The maintenance and renovation periods for such pavem…',
            publisher: 'ScienceDirect'
        });
    });

});