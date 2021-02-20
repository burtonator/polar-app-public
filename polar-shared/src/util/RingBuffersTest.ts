import {assert} from 'chai';
import {RingBuffers} from "./RingBuffers";

describe('RingBuffers', function() {

    describe('basic', function() {

        it("basic", function() {

            const ringBuffer = RingBuffers.create<string>(2);
            assert.isUndefined(ringBuffer.prev());
            assert.isUndefined(ringBuffer.peek());

            ringBuffer.push('1');

            assert.isUndefined(ringBuffer.prev());
            assert.equal(ringBuffer.peek(), '1');

            ringBuffer.push('2');

            assert.equal(ringBuffer.prev(), '1');
            assert.equal(ringBuffer.peek(), '2');

            ringBuffer.push('3');

            assert.equal(ringBuffer.prev(), '2');
            assert.equal(ringBuffer.peek(), '3');

            ringBuffer.push('4');

            assert.equal(ringBuffer.prev(), '3');
            assert.equal(ringBuffer.peek(), '4');

            ringBuffer.push('5');

            assert.equal(ringBuffer.prev(), '4');
            assert.equal(ringBuffer.peek(), '5');

        });

    });

});
