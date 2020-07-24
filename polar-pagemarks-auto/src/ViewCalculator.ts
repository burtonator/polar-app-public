import {Page, View} from "./ViewVisibilityCalculator";

export type CSSSelector = string;

export interface Selectors {
    readonly container: CSSSelector;
    readonly page: CSSSelector;
}

/**
 * Computes the ranges within a scroll parent.
 *
 * https://stackoverflow.com/questions/20223243/js-get-percentage-of-an-element-in-viewport
 */
export class ViewCalculator {

    public static compute(selectors: Selectors): View {

        // FIXME: this code isn't safe for Polar 2.0 either!!!!

        // const selectors = {
        //     container: '#viewerContainer',
        //     page: '.page',
        // };

        const computePages = (): ReadonlyArray<Page> => {

            const container = <HTMLElement> document.querySelector(selectors.container);

            if (! container) {
                throw new Error("No container");
            }

            const containerOffsetTop = container.offsetTop;

            let id = 0;
            const toPage = (page: HTMLElement) => {

                const top = page.offsetTop - containerOffsetTop;
                const bottom = top + page.offsetHeight;

                return {id: ++id, top, bottom};

            };

            const pages = <ReadonlyArray<HTMLElement>> Array.from(container.querySelectorAll(selectors.page));

            return pages.map(toPage);

        };

        const computeViewport = () => {

            const container = <HTMLElement> document.querySelector(selectors.container);

            if (! container) {
                throw new Error("No container");
            }

            return {
                top: container.scrollTop,
                bottom: container.scrollTop + container.offsetHeight
            };

        };

        const pages = computePages();
        const viewport = computeViewport();

        return {pages, viewport};

    }

}
