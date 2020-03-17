import {Version} from "./Version";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('Version', function() {

    it("basic", function() {
        Version.get();
    });

    it("parsed", function() {
        assertJSON(Version.parsed('1.90.2'), {
            "major": "1",
            "minor": "90",
            "sub": "2"
        });
    });

    it("tokenized", function() {
        assertJSON(Version.tokenized('1.90.2'), {
            "version_major": "1",
            "version_minor": "1.90",
            "version": "1.90.2"
        });
    });

});
