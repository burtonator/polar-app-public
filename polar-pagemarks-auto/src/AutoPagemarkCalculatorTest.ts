import {ViewVisibilityCalculator, View} from "./ViewVisibilityCalculator";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('AutoPagemarkCalculator', function() {

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

        assertJSON(ViewVisibilityCalculator.calculate(view), [
            {
                "id": 1,
                "top": 10,
                "bottom": 20,
                "perc": 1
            }
        ]);

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

        assertJSON(ViewVisibilityCalculator.calculate(view), [
            {
                "id": 1,
                "top": 10,
                "bottom": 20,
                "perc": 0.5
            }
        ]);

    });


});
