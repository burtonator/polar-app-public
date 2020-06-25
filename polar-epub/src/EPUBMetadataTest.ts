import {EPUBMetadata} from "./EPUBMetadata";
import {FilePaths} from "polar-shared/src/util/FilePaths";

describe('EPUBMetadata', function() {

    it("basic", async function() {
        await EPUBMetadata.getMetadata(FilePaths.resolve(__dirname, '../test/'));
    });

});
