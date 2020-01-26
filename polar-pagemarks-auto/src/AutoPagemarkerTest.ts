import {AutoPagemarker} from "./AutoPagemarker";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {AutoPagemarkCalculator, Page, View, Viewport, ViewVisibility} from "./AutoPagemarkCalculator";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Numbers} from "polar-shared/src/util/Numbers";

const createView = (viewport: Viewport,
                    nrPages: number): View => {

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

const createViewVisibility = (viewport: Viewport,
                              nrPages: number): ViewVisibility => {

    const view = createView(viewport, nrPages);

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

        const viewport: Viewport = {
            top: 0,
            bottom: 1100
        };

        const pagemarker = new AutoPagemarker(NULL_FUNCTION);

        const viewVisibility = createViewVisibility(viewport, 2);

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

    it("two half visible", async function () {

        // TODO/FIXME: rework this text by creating the raw pages,
        // then moving the viewpoint and then using the
        // ViewCalculator

        const nrPages = 10;

        let pagemarked: number | undefined;

        const pagemarker = new AutoPagemarker(page => pagemarked = page);

        const doTest = (viewport: Viewport, expected: any) => {

            const viewVisibility = createViewVisibility(viewport, 10);

            const result = pagemarker.compute(viewVisibility);

            assertJSON(result, expected);

        };

        doTest(
            {
                top: 0,
                bottom: 1100
            },
            {
                "position": {
                    "pageVisibility": {
                        "bottom": 1100,
                        "id": 1,
                        "perc": 1.0,
                        "top": 0
                    },
                    "timestamp": 1330688329321
                },
                "strategy": "init"
            });

        TestingTime.forward('15s');

        doTest(
            {
                top: 500,
                bottom: 1600
            },
            {
                "position": {
                    "pageVisibility": {
                        "bottom": 1100,
                        "id": 1,
                        "perc": 0.5454545454545454,
                        "top": 0
                    },
                    "timestamp": 1330688344321
                },
                "strategy": "jumped"
            }
        );

        TestingTime.forward('15s');

        doTest(
            {
                top: 1100,
                bottom: 2200
            },
            {
                "pagemarked": 1,
                "position": {
                    "pageVisibility": {
                        "bottom": 2200,
                        "id": 2,
                        "perc": 1,
                        "top": 1100
                    },
                    "timestamp": 1330688359321
                },
                "strategy": "created"
            }
        );

    });


});
