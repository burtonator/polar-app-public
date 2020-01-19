import {URLParams} from "./URLParams";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('URLParams', function() {

    it("parse", function() {

        assertJSON(URLParams.parse('http://www.example.com/foo/bar').toJSON(), {});
        assertJSON(URLParams.parse('http://www.example.com/foo/bar?cat=dog').toJSON(), {'cat': 'dog'});
        assertJSON(URLParams.parse('http://www.example.com/foo/bar?cat=dog&bird=mouse').toJSON(), {'cat': 'dog', 'bird': 'mouse'});


        assertJSON(URLParams.parse("https://app.getpolarized.io/add/?file=http://cdn.ca9.uscourts.gov/datastore/opinions/2019/09/09/17-16783.pdf&docInfo=%7B%22title%22%3A%229th%20Circuit%20holds%20that%20scraping%20a%20public%20website%20does%20not%20violate%20the%20CFAA%20%5Bpdf%5D%22%7D").toJSON(), {
            "docInfo": "{\"title\":\"9th Circuit holds that scraping a public website does not violate the CFAA [pdf]\"}",
            "file": "http://cdn.ca9.uscourts.gov/datastore/opinions/2019/09/09/17-16783.pdf"
        });

        // the first step is fine... it's the redirect step that's broken
        assertJSON(URLParams.parse("https://app.getpolarized.io/pdfviewer/web/index.html?file=https%3A%2F%2Fstorage.googleapis.com%2Fpolar-32b0f.appspot.com%2Fcache%2F1ReSVCZAfeNU4gWGM1wZ.pdf&docInfo=%7B%22title%22%3A%229th%2BCircuit%2Bholds%2Bthat%2Bscraping%2Ba%2Bpublic%2Bwebsite%2Bdoes%2Bnot%2Bviolate%2Bthe%2BCFAA%2B%5Bpdf%5D%22%7D&filename=12cVhJCQJ1-1ReSVCZAfeNU4gWGM1wZ.pdf").toJSON(), {});

        // this is the second URL that's redirected.

        assertJSON(URLParams.parse("https://app.getpolarized.io/pdfviewer/web/index.html?file=https%3A%2F%2Fstorage.googleapis.com%2Fpolar-32b0f.appspot.com%2Fcache%2F1ReSVCZAfeNU4gWGM1wZ.pdf&preview=true&docInfo=%7B%22title%22%3A%229th%2BCircuit%2Bholds%2Bthat%2Bscraping%2Ba%2Bpublic%2Bwebsite%2Bdoes%2Bnot%2Bviolate%2Bthe%2BCFAA%2B%5Bpdf%5D%22%7D").toJSON(), {});

    });

});
