import {ConsoleRecorder} from "./ConsoleRecorder";
import {assertJSON} from "polar-test/src/test/Assertions";
import {assert} from 'chai';
import {TestingTime} from "../test/TestingTime";

xdescribe('ConsoleRecord', function() {

    beforeEach(() => {
        TestingTime.freeze();
        ConsoleRecorder.start();
    });

    afterEach(() => {
        ConsoleRecorder.stop();
        TestingTime.unfreeze();
    });

    it('log with no args', function() {

        console.log("Hello world")

        assertJSON(ConsoleRecorder.snapshot(), [
            {
                "created": "2012-03-02T11:38:49.321Z",
                "level": "info",
                "message": "Hello world",
                "params": []
            }
        ]);

    });

    it('log', function() {

        console.log("Hello world", 'arg0', 'arg1')

        assertJSON(ConsoleRecorder.snapshot(), [
            {
                "created": "2012-03-02T11:38:49.321Z",
                "level": "info",
                "message": "Hello world",
                "params": [
                    "arg0",
                    "arg1"
                ]
            }
        ]);

    });

    it('error', function() {

        console.error("Fake error", new Error('this is the error thrown'))

        assertJSON(ConsoleRecorder.snapshot(), [
            {
                "created": "2012-03-02T11:38:49.321Z",
                "level": "error",
                "message": "Fake error",
                "params": [
                    {
                        "name": "Error",
                        "message": "this is the error thrown",
                        "stack": "Error: this is the error thrown\n    at Context.<anonymous> (/Users/burton/projects/polar-app/packages/polar-app-public/polar-shared/src/util/ConsoleRecorderTest.ts:54:37)\n    at callFn (/Users/burton/projects/polar-app/node_modules/mocha/lib/runnable.js:364:21)\n    at Test.Runnable.run (/Users/burton/projects/polar-app/node_modules/mocha/lib/runnable.js:352:5)\n    at Runner.runTest (/Users/burton/projects/polar-app/node_modules/mocha/lib/runner.js:677:10)\n    at /Users/burton/projects/polar-app/node_modules/mocha/lib/runner.js:801:12\n    at next (/Users/burton/projects/polar-app/node_modules/mocha/lib/runner.js:594:14)\n    at /Users/burton/projects/polar-app/node_modules/mocha/lib/runner.js:604:7\n    at next (/Users/burton/projects/polar-app/node_modules/mocha/lib/runner.js:486:14)\n    at cbHookRun (/Users/burton/projects/polar-app/node_modules/mocha/lib/runner.js:551:7)\n    at done (/Users/burton/projects/polar-app/node_modules/mocha/lib/runnable.js:308:5)\n    at callFn (/Users/burton/projects/polar-app/node_modules/mocha/lib/runnable.js:387:7)\n    at Hook.Runnable.run (/Users/burton/projects/polar-app/node_modules/mocha/lib/runnable.js:352:5)\n    at next (/Users/burton/projects/polar-app/node_modules/mocha/lib/runner.js:510:10)\n    at Immediate._onImmediate (/Users/burton/projects/polar-app/node_modules/mocha/lib/runner.js:572:5)\n    at processImmediate (internal/timers.js:461:21)"
                    }
                ]
            }
        ]);

    });

    it('clear', function() {

        console.log("Hello world", 'arg0', 'arg1')

        assert.equal(ConsoleRecorder.snapshot().length, 1);

        ConsoleRecorder.clear();

        assert.equal(ConsoleRecorder.snapshot().length, 0);

    });

});
