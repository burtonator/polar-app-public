import { assertJSON } from 'polar-test/src/test/Assertions';
import {Domains} from "./Domains";

describe('Domains', function() {

    it("basic", () => {

        assertJSON(Domains.computeAllSubdomains("example.com"), [
            "example.com",
            "com"
        ]);

        assertJSON(Domains.computeAllSubdomains("foo.example.com"), [
            "foo.example.com",
            "example.com",
            "com"
        ]);

        assertJSON(Domains.computeAllSubdomains("com"), [
            "com"
        ]);

    });

});

