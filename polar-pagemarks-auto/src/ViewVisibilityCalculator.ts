/*

 +----------------+  <-----------------+
 |                |                    |
 +----------------+  <--------+        |
 |                |           |        |
 |                |  viewport |   page |
 |                |           |        |
 +----------------+  <--------+        |
 |                |                    |
 +----------------+  <-----------------+
 */

import {UnixTimeMS} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Percentage1} from "polar-shared/src/util/Percentages";

export interface Block {
    readonly top: number;
    readonly bottom: number;
}

export interface Viewport extends Block {
}

export interface Page extends Block {
    readonly id: number;
}

export interface PageVisibility extends Page {
    readonly perc: Percentage1;
}

export interface View {
    readonly viewport: Viewport;
    readonly pages: ReadonlyArray<Page>;
}

export interface ViewVisibility {
    readonly viewport: Viewport;
    readonly visibilities: ReadonlyArray<PageVisibility>;
    readonly computed: UnixTimeMS;
}
/**
 * Basic pagemark calculator.
 *
 * This is modeled after three main components:
 *
 *  The 'view' is just a block with a height.
 *
 *  The 'viewport' is a window into that view.  It's basically the screen.
 *
 *  A 'page' can be seen through a viewwport and may or may not be visible.
 *
 */
export class ViewVisibilityCalculator {

    public static calculate(view: View): ViewVisibility {

        function computeCoverage(page: Page): PageVisibility {

            const visibleBottom = Math.min(page.bottom, view.viewport.bottom);
            const visibleTop = Math.max(page.top, view.viewport.top);
            const visible = visibleBottom - visibleTop;

            const height = page.bottom - page.top;

            const perc = visible / height;

            return {...page, perc};

        }

        const visibilities = view.pages.map(computeCoverage);

        return {
            viewport: view.viewport,
            visibilities,
            computed: Date.now()
        };

    }

    public static visible(visibilities: ReadonlyArray<PageVisibility>): ReadonlyArray<PageVisibility> {
        return visibilities.filter(current => current.perc > 0);
    }

}
