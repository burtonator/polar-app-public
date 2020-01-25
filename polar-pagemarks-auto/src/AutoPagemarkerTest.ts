import {AutoPagemarker, PageID} from "./AutoPagemarker";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AutoPagemarkCalculator, Page, PageVisibility, View, Viewport, ViewVisibility} from "./AutoPagemarkCalculator";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Numbers} from "polar-shared/src/util/Numbers";

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

const createView = (nrPages: number): View => {

    const height = 1100;

    const createPage = (page: number): Page => {

        const bottom = (page * height);
        const top = bottom - height;

        return {
            id: page,
            top, bottom
        };

    };

    const pages = Numbers.range(1, nrPages)
                    .map(createPage);

    return {
        viewport,
        pages
    };

};

const createViewVisibility = (nrPages: number): ViewVisibility => {

    const view = createView(nrPages);

    return AutoPagemarkCalculator.calculate(view);

};

describe('AutoPagemarker', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("basic fully visible", async function () {

        // TODO/FIXME: rework this text by creating the raw pages,
        // then moving the viewpoint and then using the
        // ViewCalculator

        const pagemarker = new AutoPagemarker(NULL_FUNCTION);

        const viewVisibility = createViewVisibility(2);

        const result = pagemarker.compute(viewVisibility);

        assertJSON(result, {
            "position": {
                "pageVisibility": {
                    "bottom": 1100,
                    "id": 1,
                    "perc": 1,
                    "top": 0
                },
                "timestamp": 1330688329321
            },
            "strategy": "init"
        });

    });

});
