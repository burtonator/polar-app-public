import {assert} from "chai";
import {ReleaseMetadatas} from "./ReleaseMetadatas";

describe('ReleaseMetadatas', function() {

    it("basic", function() {
        const releases = ReleaseMetadatas.get()
        assert.ok(Array.isArray(releases));
        assert.ok(releases.length > 0);
    });

});

