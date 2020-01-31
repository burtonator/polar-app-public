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

        // this is the second URL that's redirected.

        assertJSON(URLParams.parse("http://localhost/add/?docInfo=%7B%22title%22%3A%229th+Circuit+holds+that+scraping+a+public+website+does+not+violate+the+CFAA+%5Bpdf%5D%22%7D&file=http%3A%2F%2Fcdn.ca9.uscourts.gov%2Fdatastore%2Fopinions%2F2019%2F09%2F09%2F17-16783.pdf").toJSON(),
            {
                "docInfo": "{\"title\":\"9th Circuit holds that scraping a public website does not violate the CFAA [pdf]\"}",
                "file": "http://cdn.ca9.uscourts.gov/datastore/opinions/2019/09/09/17-16783.pdf"
            });

    });

});
