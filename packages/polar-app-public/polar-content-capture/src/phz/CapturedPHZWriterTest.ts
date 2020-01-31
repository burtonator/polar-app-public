import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {MockCapturedContent} from './MockCapturedContent';
import {CapturedPHZWriter} from './CapturedPHZWriter';
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {PHZWriter} from "./PHZWriter";

describe('CapturedPHZWriter', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("write out captured JSON", async function () {

        const captured = MockCapturedContent.create();

        const output = new PHZWriter(FilePaths.tmpfile("captured.phz"));

        const capturedPHZWriter = new CapturedPHZWriter(output);
        await capturedPHZWriter.convert(captured);

    });

});
