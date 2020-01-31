import {assert} from 'chai';
import {Provider, Providers} from "./Providers";
import {AsyncProviders} from './Providers';
import {TestingTime} from "../test/TestingTime";
import {TimeDurations} from "./TimeDurations";

describe('Providers', function() {

    afterEach(function() {
        TestingTime.unfreeze();
    });

    describe('cached', function() {

        it("basic", async function() {

            TestingTime.freeze();

            let called: number = 0;

            const backingProvider: Provider<string> = () => {
                ++called;
                return 'hello';
            };

            const cachedProvider = Providers.cached('5m', backingProvider);

            assert.equal(called, 0);

            cachedProvider();
            assert.equal(called, 1);

            cachedProvider();
            assert.equal(called, 1);

            cachedProvider();
            assert.equal(called, 1);

            TestingTime.forward(TimeDurations.toMillis('4m'));

            cachedProvider();
            assert.equal(called, 1);

            TestingTime.forward(TimeDurations.toMillis('5m'));

            cachedProvider();
            assert.equal(called, 2);

            cachedProvider();
            assert.equal(called, 2);

        });

    });

    it('toInterface', function() {

        assert.equal('101', Providers.toInterface('101').get());

        assert.equal('101', Providers.toInterface(() => '101').get());

    });

});



describe('AsyncProviders', function() {

    it('verify not resolved before first call', async function() {

        // make sure the function is not resolved before we await it...

        let resolved: boolean = false;

        const memo = AsyncProviders.memoize(async () => {
            resolved = true;
        });

        assert.equal(resolved, false);

        await memo();

        assert.equal(resolved, true);

    });

    it('verify only resolved once', async function() {

        // make sure the function is not resolved before we await it...

        let resolved: number = 0;

        const memo = AsyncProviders.memoize(async () => {
            ++resolved;
        });

        assert.equal(resolved, 0);
        await memo();
        assert.equal(resolved, 1);
        await memo();
        assert.equal(resolved, 1);
        await memo();
        assert.equal(resolved, 1);
        await memo();
        assert.equal(resolved, 1);

    });

});
