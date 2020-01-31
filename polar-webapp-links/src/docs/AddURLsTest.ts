import {assert} from 'chai';
import {assertJSON} from "polar-test/src/test/Assertions";
import {AddURLs} from "./AddURLs";

describe('AddURLs', function() {

    it("parse", function() {

        assertJSON(AddURLs.parse('/add/https://bitcoin.org/bitcoin.pdf'), {
            "target": "https://bitcoin.org/bitcoin.pdf"
        });

        assertJSON(AddURLs.parse('https://app.getpolarized.io/add/https://bitcoin.org/bitcoin.pdf'), {
            "target": "https://bitcoin.org/bitcoin.pdf"
        });

        assertJSON(AddURLs.parse('/add/https/bitcoin.org/bitcoin.pdf'), {
            "target": "https://bitcoin.org/bitcoin.pdf"
        });

        assertJSON(AddURLs.parse('/add/https:/bitcoin.org/bitcoin.pdf'), {
            "target": "https://bitcoin.org/bitcoin.pdf"
        });

    });

    it("createCorrectedURL", function() {

        assert.equal(AddURLs.createCorrectedURL('https://bitcoin.org/bitcoin.pdf'), 'https://bitcoin.org/bitcoin.pdf');
        assert.equal(AddURLs.createCorrectedURL('https:/bitcoin.org/bitcoin.pdf'), 'https://bitcoin.org/bitcoin.pdf');
        assert.equal(AddURLs.createCorrectedURL('https/bitcoin.org/bitcoin.pdf'), 'https://bitcoin.org/bitcoin.pdf');

    });


    it("with full param", function() {

        assertJSON(AddURLs.parse('https://app.getpolarized.io/add/?file=http://cdn.ca9.uscourts.gov/datastore/opinions/2019/09/09/17-16783.pdf&docInfo=%7B%22title%22%3A%229th%20Circuit%20holds%20that%20scraping%20a%20public%20website%20does%20not%20violate%20the%20CFAA%20%5Bpdf%5D%22%7D'),
            {
                "docInfo": {
                    "title": "9th Circuit holds that scraping a public website does not violate the CFAA [pdf]"
                },
                "target": "http://cdn.ca9.uscourts.gov/datastore/opinions/2019/09/09/17-16783.pdf"
            }
        );
    });

});
