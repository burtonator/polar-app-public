import {AutoPagemarker, PageID} from "./AutoPagemarker";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {PageVisibility, Viewport, ViewVisibility} from "./AutoPagemarkCalculator";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assertJSON} from "polar-test/src/test/Assertions";

const viewport: Viewport = {
    top: 0,
    bottom: 1100
};

const createPageVisibility = (page: PageID,
                              top: number,
                              bottom: number,
                              perc: number): PageVisibility => {

    return {
        id: page,
        top,
        bottom,
        perc
    };

};

const createViewVisibility = (): ViewVisibility => {
    const computed = Date.now();

    return {
        viewport,
        visibilities: [
            createPageVisibility(1, 0, 1100, 100),
            createPageVisibility(2, 1100, 2200, 0),
        ],
        computed
    };
};

describe('AutoPagemarker', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("basic fully visible", async function () {

        const pagemarker = new AutoPagemarker(NULL_FUNCTION);


        const viewVisibility = createViewVisibility();

        const result = pagemarker.compute(viewVisibility);

        assertJSON(result, {
            "position": {
                "pageVisibility": {
                    "bottom": 1100,
                    "id": 1,
                    "perc": 100,
                    "top": 0
                },
                "timestamp": 1330688329321
            },
            "strategy": "init"
        });

    });

});
