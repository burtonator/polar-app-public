import {assert} from 'chai';
import { Latch } from './Latch';


describe('Latch', function() {

    it("basic", async function() {

        const latch = new Latch<string>();

        latch.resolve("hello");

        assert.equal(await latch.get(), "hello");
        assert.equal(await latch.get(), "hello");
        assert.equal(await latch.get(), "hello");
        assert.equal(await latch.get(), "hello");

    });


    it("reject", async function() {

        const latch = new Latch<string>();

        let failures = 0;

        latch.reject(new Error('hello'));

        try {

            await latch.get();
            assert.fail("Should not succeed");

        } catch (e) {
            ++failures;
        }

        assert.equal(failures, 1);

    });

});

