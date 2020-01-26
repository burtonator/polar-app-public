import {ViewCalculator} from "./ViewCalculator";
import {ViewVisibilityCalculator} from "./ViewVisibilityCalculator";
import {AutoPagemarker, AutoPagemarkerMode, ExtendPagemark} from "./AutoPagemarker";
import {Logger} from "polar-shared/src/logger/Logger";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

export class Scrollers {

    public static register(extender: (extendPagemark: ExtendPagemark) => void,
                           mode: AutoPagemarkerMode) {

        const selectors = {
            container: '#viewerContainer',
            page: '.page',
        };

        // FIXME: this has to use the task scheduler to avoid wasting too much CPU time.

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

        container!.addEventListener('scroll', (event) => {

            handleScroll();

        });

    }

}
