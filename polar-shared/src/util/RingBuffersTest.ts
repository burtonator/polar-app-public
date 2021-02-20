import {assert} from 'chai';
import {RingBuffers} from "./RingBuffers";

describe('RingBuffers', function() {

    describe('basic', function() {

        it("basic", function() {

            const ringBuffer = RingBuffers.create<string>(2);
            assert.isUndefined(ringBuffer.prev());
            assert.isUndefined(ringBuffer.peek());
            assert.equal(ringBuffer.length(), 2);
            assert.equal(ringBuffer.size(), 0);

            assert.equal(ringBuffer.toArray().join(""), "");

            ringBuffer.push('1');

            assert.isUndefined(ringBuffer.prev());
            assert.equal(ringBuffer.peek(), '1');
            assert.equal(ringBuffer.size(), 1);
            assert.equal(ringBuffer.toArray().join(""), "1");

            ringBuffer.push('2');

            assert.equal(ringBuffer.prev(), '1');
            assert.equal(ringBuffer.peek(), '2');
            assert.equal(ringBuffer.size(), 2);
            assert.equal(ringBuffer.toArray().join(""), "12");

            ringBuffer.push('3');

            assert.equal(ringBuffer.prev(), '2');
            assert.equal(ringBuffer.peek(), '3');
            assert.equal(ringBuffer.size(), 2);
            assert.equal(ringBuffer.toArray().join(""), "23");

            ringBuffer.push('4');

            assert.equal(ringBuffer.prev(), '3');
            assert.equal(ringBuffer.peek(), '4');
            assert.equal(ringBuffer.size(), 2);
            assert.equal(ringBuffer.toArray().join(""), "34");

            ringBuffer.push('5');

            assert.equal(ringBuffer.prev(), '4');
            assert.equal(ringBuffer.peek(), '5');
            assert.equal(ringBuffer.size(), 2);
            assert.equal(ringBuffer.toArray().join(""), "45");

        });

    });

});
