import {assert} from 'chai';
import {TimeDurations} from './TimeDurations';
import {TestingTime} from '../test/TestingTime';

describe('TimeDurations', function() {

    it("basic", function() {

        assert.equal(TimeDurations.toMillis('-1w'), -604800000);
        assert.equal(TimeDurations.toMillis('1w'), 604800000);

    });



    it("hasExpired", function() {

        // console.log(ISODateTimeStrings.create());

        TestingTime.freeze();

        const since = new Date();

        assert.notOk(TimeDurations.hasElapsed(since, '1d'));
        TestingTime.forward('1h');
        assert.notOk(TimeDurations.hasElapsed(since, '1d'));
        TestingTime.forward('22h');
        assert.notOk(TimeDurations.hasElapsed(since, '1d'));
        TestingTime.forward('1h');
        assert.notOk(TimeDurations.hasElapsed(since, '1d'));

        TestingTime.forward('1ms');
        assert.ok(TimeDurations.hasElapsed(since, '1d'));

    });

    it('nrWeeks', function() {

        TestingTime.freeze();

        const doTest = (sinceDuration: string, expected: string) => {

            const since = new Date(Date.now() - TimeDurations.toMillis(sinceDuration));

            assert.equal(TimeDurations.inWeeks(since), expected);

        };

        doTest('1w', '1w');
        doTest('1d', '0w');
        doTest('8d', '1w');
        doTest('14d', '2w');
        doTest('15d', '2w');

    });

    describe('toMillis', function() {

        it('basic', function() {

            assert.equal(TimeDurations.toMillis('1s'), 1000);
            assert.equal(TimeDurations.toMillis('1m'), 60000);
            assert.equal(TimeDurations.toMillis('1h'), 60 * 60 * 1000);
            assert.equal(TimeDurations.toMillis('1d'), 24 * 60 * 60 * 1000);
            assert.equal(TimeDurations.toMillis('1ms'), 1);

        });

    });

    describe('format', function() {

        it('basic', function() {

            assert.equal(TimeDurations.format('1ms'), '1ms');
            assert.equal(TimeDurations.format('1s'), '1s');
            assert.equal(TimeDurations.format('1m'), '1m');
            assert.equal(TimeDurations.format('1h'), '1h');
            assert.equal(TimeDurations.format('1d'), '1d');

        });

        it('multi-part', function() {

            const _2D = TimeDurations.toMillis('2d');
            const _1D = TimeDurations.toMillis('1d');
            const _1M = TimeDurations.toMillis('1m');
            const _1S = TimeDurations.toMillis('1s');

            assert.equal(TimeDurations.format(_2D + _1S), '2d1s');
            assert.equal(TimeDurations.format(_1D + _1M), '1d1m');
            assert.equal(TimeDurations.format(_1M + _1D  + _1S), '1d1m1s');

            // assert.equal(TimeDurations.format('1s'), '1s');
            // assert.equal(TimeDurations.format('1m'), '1m');
            // assert.equal(TimeDurations.format('1h'), '1h');
            // assert.equal(TimeDurations.format('1d'), '1d');

        });


    });

});
