import {ViewCalculator} from "./ViewCalculator";
import {ViewVisibilityCalculator} from "./ViewVisibilityCalculator";
import {AutoPagemarker, AutoPagemarkerMode, ExtendPagemark} from "./AutoPagemarker";
import {Logger} from "polar-shared/src/logger/Logger";
import {TaskThrottler} from "./TaskThrottler";

const log = Logger.create();

export class Scrollers {

    public static register(extender: (extendPagemark: ExtendPagemark) => void,
                           mode: AutoPagemarkerMode) {

        const selectors = {
            container: '#viewerContainer',
            page: '.page',
        };

        const onPagemarkCreated = (extendPagemark: ExtendPagemark) => {
            extender(extendPagemark);
            log.debug("New page auto pagemarked... ", extendPagemark);
        };

        const autoPagemarker = new AutoPagemarker(onPagemarkCreated, mode);

        const handleScroll = () => {

            const view = ViewCalculator.compute(selectors);
            const viewVisibility = ViewVisibilityCalculator.calculate(view);

            autoPagemarker.compute(viewVisibility);

        };

        const container = document.querySelector(selectors.container);

        const throttler = new TaskThrottler(250);

        container!.addEventListener('scroll', (event) => {
            throttler.schedule(() => handleScroll());
        });

    }

}
