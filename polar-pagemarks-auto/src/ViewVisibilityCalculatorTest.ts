import {ViewVisibilityCalculator, View} from "./ViewVisibilityCalculator";
import {assertJSON} from "polar-test/src/test/Assertions";
import {TestingTime} from "polar-shared/src/test/TestingTime";

describe('ViewVisibilityCalculator', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("basic fully visible", async function () {

        const view: View = {
            viewport: {
                top: 0,
                bottom: 100
            },
            pages: [
                {
                    id: 1,
                    top: 10,
                    bottom: 20
                }
            ]
        };

        assertJSON(ViewVisibilityCalculator.calculate(view), {
            "computed": 1330688329321,
            "viewport": {
                "bottom": 100,
                "top": 0
            },
            "visibilities": [
                {
                    "bottom": 20,
                    "id": 1,
                    "perc": 1,
                    "top": 10
                }
            ]
        });

    });

    it("basic half visible", async function () {

        const view: View = {
            viewport: {
                top: 15,
                bottom: 100
            },
            pages: [
                {
                    id: 1,
                    top: 10,
                    bottom: 20
                }
            ]
        };

        assertJSON(ViewVisibilityCalculator.calculate(view), {
            "computed": 1330688329321,
            "viewport": {
                "bottom": 100,
                "top": 15
            },
            "visibilities": [
                {
                    "bottom": 20,
                    "id": 1,
                    "perc": 0.5,
                    "top": 10
                }
            ]
        });

    });


});
