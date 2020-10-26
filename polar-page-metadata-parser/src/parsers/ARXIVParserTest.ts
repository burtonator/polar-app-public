import {assert} from "chai";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Fetches } from "polar-shared/src/util/Fetch";
import { DOMParser } from 'xmldom';
import { ARXIVParser } from './ARXIVParser';

describe('ARXIVParser', function () {

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

        var text : string = '';
        const url = "https://arxiv.org/abs/2010.09039";

        // if test file exists
        if (existsSync('src/test/arxiv1.html')) {
            console.log('The path exists.');
            text = readFileSync('src/test/arxiv1.html').toString()
        
        // else fetch test html
        } else {
            const response = await Fetches.fetch(url);
    
            text = await response.text();
            writeFileSync('src/test/arxiv1.html', text)
        }

        const parser = new DOMParser();
        const doc : Document = parser.parseFromString(text, "text/xml");

        const arxivParser = new ARXIVParser();
        const data = arxivParser.parse(doc)

        if (data === undefined) {
            assert(false);
        } else {
            assert(data.url === 'https://arxiv.org/abs/2010.09039v1')
            assert(data.pdfURL === 'https://arxiv.org/pdf/2010.09039')
            assert(data.title === 'On licenses for [Open] Hardware')

            if (data.authors === undefined) {
                assert(false);
            } else {
                assert(data.authors[0] === 'Montón, Màrius')
                assert(data.authors[1] === 'Salazar, Xavier')
            }
            
            assert(data.summary === `This document explains the basic concepts related to software and hardware
licenses, and it summarizes the most popular licenses that are currently used
for hardware projects. Two case studies of hardware projects at different
levels of abstraction are also presented, together with a discussion of license
applicability, commercial issues, code protection, and related concerns. This
paper intends to help the reader understand how to release open hardware with
the most appropriate license, and to answer questions that are of current
interest. We have been mainly motivated by the growing influence of the open
RISC-V ISA, but trying to address a wider hardware point of view.`)
        }

    });

});
