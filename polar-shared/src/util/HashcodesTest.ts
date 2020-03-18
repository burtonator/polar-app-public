import {assert} from 'chai';

import {Hashcodes} from './Hashcodes';
import {FilePaths} from './FilePaths';
import {Files} from './Files';

describe('Hashcodes', function() {

    describe('create', function() {

        it("basic", function () {

            const hashcode = Hashcodes.create("asdf");

            assert.equal(hashcode, "1aibZzMnnHwqHd9cmMb2QrRdgyBj5ppNHgCTqxqggN8KRN4jtu");

        });

    });

    describe('createFromStream', function() {

        it("basic", async function () {

            const data = "this is a test";

            let path = FilePaths.createTempName('hash-test-data.txt');

            await Files.writeFileAsync(path, data);

            const hashcode = await Hashcodes.createFromStream(Files.createReadStream(path));

            assert.equal(hashcode, "12DPFtaSkqZ1BDBXxY47ThYmzinkWJ6jCMmuJvVZfCdaNViiRwu");

        });

    });


});
