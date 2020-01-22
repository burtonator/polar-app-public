import {ViewCalculator} from "./ViewCalculator";
import {AutoPagemarkCalculator} from "./AutoPagemarkCalculator";

export class Scrollers {

    public static register() {

        const selectors = {
            container: '#viewerContainer',
            page: '.page',
        };

        const handleScroll = () => {

            const view = ViewCalculator.compute(selectors);
            const viewVisibility = AutoPagemarkCalculator.calculate(view);

            const visible = viewVisibility.visibilities.filter(current => current.perc > 0);

        };

        const container = document.querySelector(selectors.container);

        container!.addEventListener('scroll', (event) => {

            handleScroll();

        });

    }

}
