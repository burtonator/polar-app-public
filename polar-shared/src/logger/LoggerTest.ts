import {assert} from 'chai';
import {TestingTime} from '../test/TestingTime';
import {Logger} from './Logger';

TestingTime.freeze();

describe('Logger', function() {

    it("basic", function () {

        // FIXME: we can't capture console output I think but maybe I can figure
        // out in the future how to write it to a specific file.

        const log = Logger.create();

        assert.equal(log != null, true);

    });

    it("with two arguments", function () {

        // FIXME: we can't capture console output I think but maybe I can figure
        // out in the future how to write it to a specific file.

        const log = Logger.create();

        const hello = {msg: 'hello'};
        const world = {msg: 'world'};
        log.info("with two arguments:", hello, world);

    });


    it("with exception", function () {

        // FIXME: we can't capture console output I think but maybe I can figure
        // out in the future how to write it to a specific file.

        const log = Logger.create();

        log.error("This is an error: ", new Error('Something broke'));

    });

});
