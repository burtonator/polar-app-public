import {assertJSON} from "polar-test/src/test/Assertions";
import {AddURLs} from "./AddURLs";

describe('AddURLs', function() {

    it("basic", function() {

        // assertJSON(AddURLs.parse('https://app.getpolarized.io/add/https://bitcoin.org/bitcoin.pdf'), {
        //     "target": "https://bitcoin.org/bitcoin.pdf"
        // });

        assertJSON(AddURLs.parse('/add/https://bitcoin.org/bitcoin.pdf'), {
            "target": "https://bitcoin.org/bitcoin.pdf"
        });

    });

});
