import {ConsoleRecorder} from "./ConsoleRecorder";
import {assertJSON} from "polar-test/src/test/Assertions";

xdescribe('ConsoleRecord', function() {

    it('log', function() {
        ConsoleRecorder.start();

        console.log("Hello world", 'arg0', 'arg1')

        assertJSON(ConsoleRecorder.snapshot(), [
            {
                "level": "info",
                "message": "Hello world",
                "params": [
                    "arg0",
                    "arg1"
                ]
            }
        ]);

        ConsoleRecorder.stop();

    });


    it('error', function() {
        ConsoleRecorder.start();

        console.error("Fake error", new Error('this is the error thrown'))

        assertJSON(ConsoleRecorder.snapshot(), [
            {
                "level": "info",
                "message": "Hello world",
                "params": [
                    "arg0",
                    "arg1"
                ]
            }
        ]);

        ConsoleRecorder.stop();

    });

});
