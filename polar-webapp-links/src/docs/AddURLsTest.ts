import {assert} from 'chai';
import {assertJSON} from "polar-test/src/test/Assertions";
import {AddURLs} from "./AddURLs";

describe('AddURLs', function() {

    it("parse", function() {

        assertJSON(AddURLs.parse('https://app.getpolarized.io/add/https://bitcoin.org/bitcoin.pdf'), {
            "target": "https://bitcoin.org/bitcoin.pdf"
        });

        assertJSON(AddURLs.parse('/add/https://bitcoin.org/bitcoin.pdf'), {
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



});
