import {PDFTitleExtractor} from "./PDFTitleExtractor";
import {PDFDocs} from "./PDFDocs";
import {URLs} from "polar-shared/src/util/URLs";
import {assert} from 'chai';

xdescribe('PDFTitleExtractor', function() {

    xit("basic", async function () {
        const docURL = await URLs.toURL('/Users/burton/Downloads/p3181-adams.pdf');

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});
        const doc = await pdfLoadingTask.promise;

        const title = await PDFTitleExtractor.extract(doc);
        assert.equal(title, 'Monarch: Google’s Planet-Scale In-Memory Time Series Database');
    });

});
