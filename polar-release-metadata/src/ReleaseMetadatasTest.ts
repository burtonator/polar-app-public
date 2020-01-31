import {assert} from "chai";
import {ReleaseMetadatas} from "./ReleaseMetadatas";
import * as semver from 'semver';
import {Arrays} from "polar-shared/src/util/Arrays";

describe('ReleaseMetadatas', function() {

    it("basic", function() {
        const releases = ReleaseMetadatas.get();
        assert.ok(Array.isArray(releases));
        assert.ok(releases.length > 0);
    });

    it("verify sorting", function() {

        const shuffled = Arrays.shuffle(...ReleaseMetadatas.get());

        const releases = ReleaseMetadatas.sorted(shuffled);

        assert.ok(releases.length >= 2);

        const first = releases[0];
        const second = releases[1];

        console.log(first.release);
        console.log(second.release);

        assert.ok(semver.gt(first.release, second.release));

    });

});

