import {ConstructorOptions, JSDOM} from "jsdom";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Fetches } from "polar-shared/src/util/Fetch";
import { PubmedParser } from './PubmedParser';
import {assertJSON} from "polar-test/src/test/Assertions";

async function readTestData(url: string): Promise<string> {

    if (existsSync('test/pubmed1.html')) {
        console.log('The path exists.');
        return readFileSync('test/pubmed1.html').toString()
    } else {
        const response = await Fetches.fetch(url);

        const html = await response.text();
        writeFileSync('test/pubmed1.html', html)
        return html;
    }

}

describe('PubmedParser', function () {

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

        const url = "https://pubmed.ncbi.nlm.nih.gov/31527411/";
        const html = await readTestData(url);

        const doc = parseHTML(html, url);
        const parser = new PubmedParser();
        const metadata = parser.parse(doc)
        //console.log(metadata)
        assertJSON(metadata, {
            title: 'Med Diet 4.0: the Mediterranean diet with four sustainable benefits',
            doi: 'https://doi.org/10.1017/s1368980016003177',
            pmid: 'https://pubmed.ncbi.nlm.nih.gov/28003037/',
            abstract: 'By providing a broader understanding of the many sustainable benefits of the Mediterranean diet, the Med Diet 4.0 can contribute to the revitalization of the Mediterranean diet by improving its current perception not only as a healthy diet but also a sustainable lifestyle model, with country-specifi …',
            authors: [
                'Dernini S',           'Berry EM',
                'Serra-Majem L',       'La Vecchia C',
                'Capone R',            'Medina FX',
                'Aranceta-Bartrina J', 'Belahsen R',
                'Burlingame B',        'Calabrese G',
                'Corella D',           'Donini LM',
                'Lairon D',            'Meybeck A',
                'Pekcan AG',           'Piscopo S',
                'Yngve A',             'Trichopoulou A',
                ''
            ],
            url: 'https://pubmed.ncbi.nlm.nih.gov/31527411/',
            date: '2017 May',
            description: 'By providing a broader understanding of the many sustainable benefits of the Mediterranean diet, the Med Diet 4.0 can contribute to the revitalization of the Mediterranean diet by improving its current perception not only as a healthy diet but also a sustainable lifestyle model, with country-specifi …',
            publisher: 'pubmed'
        });
    });

});