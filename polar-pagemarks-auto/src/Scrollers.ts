import {ViewCalculator} from "./ViewCalculator";
import {ViewVisibilityCalculator} from "./ViewVisibilityCalculator";
import {
    AutoPagemarker,
    AutoPagemarkerMode,
    ExtendPagemark
} from "./AutoPagemarker";
import {Logger} from "polar-shared/src/logger/Logger";
import {TaskThrottler} from "./TaskThrottler";

const log = Logger.create();

export namespace Scrollers {

    export type ExtenderCallback = (extendPagemark: ExtendPagemark) => void;

    export interface RegisterOpts {
        readonly mode: AutoPagemarkerMode;
    }

    export function register(extender: ExtenderCallback,
                             opts: RegisterOpts) {

        const {mode} = opts;

        const selectors = {
            container: '#viewerContainer',
            page: '.page',
        };

        const onPagemarkCreated = (extendPagemark: ExtendPagemark) => {
            extender(extendPagemark);
            log.debug("New page auto pagemarked... ", extendPagemark);
        };

        const autoPagemarker = new AutoPagemarker(onPagemarkCreated, {mode, minDuration: 45 * 1000});

        const handleScroll = () => {

            const view = ViewCalculator.compute(selectors);
            const viewVisibility = ViewVisibilityCalculator.calculate(view);

            autoPagemarker.compute(viewVisibility);

        };

        // TODO: NOT portable to Polar 2.0 document viewer...
        const container = document.querySelector(selectors.container);

        const throttler = new TaskThrottler(250);

        container!.addEventListener('scroll', (event) => {
            throttler.schedule(() => handleScroll());
        });

    }

}
