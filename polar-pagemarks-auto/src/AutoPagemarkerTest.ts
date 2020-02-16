import {AutoPagemarker, AutoPagemarkerMode, ExtendPagemark, PageID} from "./AutoPagemarker";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Page, View, Viewport, ViewVisibility, ViewVisibilityCalculator} from "./ViewVisibilityCalculator";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Numbers} from "polar-shared/src/util/Numbers";

const DEFAULT_PAGE_HEIGHT = 1100;

const createViewportForPage = (page: PageID,
                               height: number): Viewport => {

    const bottom = (page * height);
    const top = bottom - height;

    return {top, bottom};

};

const createView = (viewport: Viewport,
                    nrPages: number,
                    height: number): View => {

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
                              nrPages: number,
                              height: number): ViewVisibility => {

    const view = createView(viewport, nrPages, height);

    return ViewVisibilityCalculator.calculate(view);

};

interface TestResult {
    extendPagemark: ExtendPagemark;
}

type Tester = (viewport: Viewport, expected: any) => TestResult;

const createTester = (nrPages: number = 10,
                      mode: AutoPagemarkerMode = 'full',
                      height: number = DEFAULT_PAGE_HEIGHT): Tester => {

    let extendPagemark: ExtendPagemark | undefined;

    // tslint:disable-next-line:variable-name
    const pagemarker = new AutoPagemarker(_extendPagemark => extendPagemark = _extendPagemark, {mode});

    return (viewport: Viewport, expected: any) => {

        const viewVisibility = createViewVisibility(viewport, nrPages, height);

        const result = pagemarker.compute(viewVisibility);

        assertJSON(result, expected);

        return {
            extendPagemark: extendPagemark!
        };

    };

};

describe('AutoPagemarker', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("basic fully visible", function () {

        // TODO/FIXME: rework this text by creating the raw pages,
        // then moving the viewpoint and then using the
        // ViewCalculator

        const viewport: Viewport = {
            top: 0,
            bottom: 1100
        };

        const pagemarked = new AutoPagemarker(NULL_FUNCTION);

        const viewVisibility = createViewVisibility(viewport, 2, DEFAULT_PAGE_HEIGHT);

        const result = pagemarked.compute(viewVisibility);

        assertJSON(result, {
            "position": {
                "created": 1330688329321,
                "origin": 1,
                "pageVisibility": {
                    "bottom": 1100,
                    "id": 1,
                    "perc": 1,
                    "top": 0
                },
                "updated": 1330688329321
            },
            "strategy": "init"
        });

    });

    it("two half visible", function () {

        const doTest = createTester();

        doTest(
            {
                top: 0,
                bottom: 1100
            },
            {
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 1100,
                        "id": 1,
                        "perc": 1,
                        "top": 0
                    },
                    "updated": 1330688329321
                },
                "strategy": "init"
            });

        TestingTime.forward('35s');

        doTest(
            {
                top: 500,
                bottom: 1600
            },
            {
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 1100,
                        "id": 1,
                        "perc": 0.5454545454545454,
                        "top": 0
                    },
                    "updated": 1330688364321
                },
                "strategy": "updated"
            }
        );

        TestingTime.forward('35s');

        const testResult = doTest(
            {
                top: 1100,
                bottom: 2200
            },
            {
                "pagemarked": 1,
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 2200,
                        "id": 2,
                        "perc": 1,
                        "top": 1100
                    },
                    "updated": 1330688399321
                },
                "strategy": "created"
            }
        );

        assertJSON(testResult.extendPagemark, {origin: 1, page: 1, perc: 100});

    });

    it("page 1, then jump, then scroll, to see if origin is right.", function () {

        const doTest = createTester();

        doTest(
            createViewportForPage(1, DEFAULT_PAGE_HEIGHT),
            {
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 1100,
                        "id": 1,
                        "perc": 1,
                        "top": 0
                    },
                    "updated": 1330688329321
                },
                "strategy": "init"
            });

        TestingTime.forward('35s');

        doTest(
            createViewportForPage(5, DEFAULT_PAGE_HEIGHT),
            {
                "position": {
                    "created": 1330688364321,
                    "origin": 5,
                    "pageVisibility": {
                        "bottom": 5500,
                        "id": 5,
                        "perc": 1,
                        "top": 4400
                    },
                    "updated": 1330688364321
                },
                "strategy": "jumped"
            }
        );

        TestingTime.forward('35s');

        const testResult = doTest(
            createViewportForPage(6, DEFAULT_PAGE_HEIGHT),
            {
                "pagemarked": 5,
                "position": {
                    "created": 1330688364321,
                    "origin": 5,
                    "pageVisibility": {
                        "bottom": 6600,
                        "id": 6,
                        "perc": 1,
                        "top": 5500
                    },
                    "updated": 1330688399321
                },
                "strategy": "created"
            }
        );

        assertJSON(testResult.extendPagemark, {origin: 5, page: 5, perc: 100});

        const testResult1 = doTest(
            createViewportForPage(7, DEFAULT_PAGE_HEIGHT),
            {
                "pagemarked": 6,
                "position": {
                    "created": 1330688364321,
                    "origin": 5,
                    "pageVisibility": {
                        "bottom": 7700,
                        "id": 7,
                        "perc": 1,
                        "top": 6600
                    },
                    "updated": 1330688399321
                },
                "strategy": "created"
            }
        );

        assertJSON(testResult1.extendPagemark, {origin: 5, page: 6, perc: 100});

    });

    xit("partial pagemarks with one large page", function () {

        const height = 5000;

        const doTest = createTester(1, 'partial', 5000);

        doTest(
            {
                top: 0,
                bottom: 1000
            },
            {
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 5000,
                        "id": 1,
                        "perc": 0.2,
                        "top": 0
                    },
                    "updated": 1330688329321
                },
                "strategy": "init"
            });

        TestingTime.forward('35s');

        const testResult = doTest(
            {
                top: 0,
                bottom: 1000
            },
            {
                "pagemarked": 1,
                "position": {
                    "created": 1330688329321,
                    "origin": 1,
                    "pageVisibility": {
                        "bottom": 5000,
                        "id": 1,
                        "perc": 0.2,
                        "top": 0
                    },
                    "updated": 1330688344321
                },
                "strategy": "created"
            });

        assertJSON(testResult.extendPagemark, {
            "origin": 1,
            "page": 1,
            "perc": 20
        });

    });


});
