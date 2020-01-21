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
            const visibilities = AutoPagemarkCalculator.calculate(view);

            console.log("FIXME: view: ", view);
            console.log("FIXME: visibilities: ", visibilities);

            const visible = visibilities.filter(current => current.perc > 0);

            console.log("FIXME: visible: ", visible);

        };

        const container = document.querySelector(selectors.container);

        container!.addEventListener('scroll', (event) => {

            handleScroll();

        });

    }

}
