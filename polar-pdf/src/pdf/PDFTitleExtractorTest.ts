import {PDFTitleExtractor} from "./PDFTitleExtractor";
import {PDFDocs} from "./PDFDocs";
import {URLs} from "polar-shared/src/util/URLs";
import {assert} from 'chai';

xdescribe('PDFTitleExtractor', function() {

    async function doTest(docPathOrURL: string, expectedTitle: string) {

        console.log(docPathOrURL);

        const docURL = await URLs.toURL(docPathOrURL);

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});
        const doc = await pdfLoadingTask.promise;

        const title = await PDFTitleExtractor.extract(doc);
        assert.equal(title, expectedTitle);

    }

    it("basic", async function () {
        // await doTest('/Users/burton/Downloads/2008.05300.pdf', 'Who Watches the Watchmen?  A Review of Subjective Approaches for Sybil-resistance in Proof of Personhood Protocols')
        // await doTest('/Users/burton/Downloads/p3181-adams.pdf', 'Monarch: Google’s Planet-Scale In-MemoryTime Series Database')
        await doTest('/Users/burton/projects/polar-app/packages/polar-test-data/pdf/klenke_probability_theory.pdf', 'Monarch: Google’s Planet-Scale In-MemoryTime Series Database')
    });

});
