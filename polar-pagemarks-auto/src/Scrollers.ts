import {ViewCalculator} from "./ViewCalculator";
import {ViewVisibilityCalculator} from "./ViewVisibilityCalculator";
import {AutoPagemarker} from "./AutoPagemarker";

export class Scrollers {

    public static register() {

        const selectors = {
            container: '#viewerContainer',
            page: '.page',
        };

        const autoPagemarker = new AutoPagemarker(page => {
            console.log("New page auto pagemarked... ", page);
        });

        const handleScroll = () => {

            const view = ViewCalculator.compute(selectors);
            const viewVisibility = ViewVisibilityCalculator.calculate(view);

            autoPagemarker.compute(viewVisibility);

        };

        const container = document.querySelector(selectors.container);

        container!.addEventListener('scroll', (event) => {

            handleScroll();

        });

    }

}
