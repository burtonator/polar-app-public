import {assertJSON} from "polar-test/src/test/Assertions";
import {Images} from "./Images";

describe('Images', function() {

    describe('constrain', function() {

        it("basic", function () {

            const constraint = {
                maxHeight: 200,
                maxWidth: 450
            }

            assertJSON(Images.constrain({width: 10, height: 10}, constraint), {
                "height": 10,
                "width": 10
            });

            assertJSON(Images.constrain({width: 500, height: 500}, constraint), {
                "height": 200,
                "width": 200
            });


            assertJSON(Images.constrain({width: 50, height: 500}, constraint), {
                "height": 200,
                "width": 20
            });

            assertJSON(Images.constrain({width: 500, height: 50}, constraint), {
                "height": 45,
                "width": 450
            });

        });

    });

});
