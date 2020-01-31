import {ConsoleLogger} from './ConsoleLogger';

describe('ConsoleLogger', function() {

    xit("Basic", function () {

        const log = new ConsoleLogger();
        log.error("asdf", new Error("fake"));

    });

});
