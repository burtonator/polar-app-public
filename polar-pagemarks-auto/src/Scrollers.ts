import {ViewCalculator} from "./ViewCalculator";
import {ViewVisibilityCalculator} from "./ViewVisibilityCalculator";
import {AutoPagemarker} from "./AutoPagemarker";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class Scrollers {

    public static register() {

        const selectors = {
            container: '#viewerContainer',
            page: '.page',
        };

        const autoPagemarker = new AutoPagemarker(extendPagemark => {
            log.debug("New page auto pagemarked... ", extendPagemark);
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
