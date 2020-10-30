import {ConstructorOptions, JSDOM} from "jsdom";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Fetches } from "polar-shared/src/util/Fetch";
import { ARXIVParser } from './ARXIVParser';
import {assertJSON} from "polar-test/src/test/Assertions";

async function readTestData(url: string): Promise<string> {

    if (existsSync('test/arxiv1.html')) {
        console.log('The path exists.');
        return readFileSync('test/arxiv1.html').toString()
    } else {
        const response = await Fetches.fetch(url);

        const html = await response.text();
        writeFileSync('test/arxiv1.html', html)
        return html;
    }

}

describe('ARXIVParser', function () {

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

        const url = "https://arxiv.org/abs/2010.09039";
        const html = await readTestData(url);

        const doc = parseHTML(html, url);
        const parser = new ARXIVParser();
        const metadata = parser.parse(doc)
        assertJSON(metadata, {
            url: 'https://arxiv.org/abs/2010.09039',
            title: 'On licenses for [Open] Hardware',
            description: 'This document explains the basic concepts related to software and hardware\n' +
            'licenses, and it summarizes the most popular licenses that are currently used\n' +
            'for hardware projects. Two case studies of hardware projects at different\n' +
            'levels of abstraction are also presented, together with a discussion of license\n' +
            'applicability, commercial issues, code protection, and related concerns. This\n' +
            'paper intends to help the reader understand how to release open hardware with\n' +
            'the most appropriate license, and to answer questions that are of current\n' +
            'interest. We have been mainly motivated by the growing influence of the open\n' +
            'RISC-V ISA, but trying to address a wider hardware point of view.',
            authors: [ 'Montón, Màrius', 'Salazar, Xavier' ],
            pdfURL: 'https://arxiv.org/pdf/2010.09039'
        });
    });

});
