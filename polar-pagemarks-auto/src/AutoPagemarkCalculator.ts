

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
    readonly perc: number;
}

export interface View {
    readonly viewport: Viewport;
    readonly pages: ReadonlyArray<Page>;
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
export class AutoPagemarkCalculator {

    public static calculate(view: View) {

        function computeCoverage(page: Page): PageVisibility {

            const visibleBottom = Math.min(page.bottom, view.viewport.bottom);
            const visibleTop = Math.max(page.top, view.viewport.top);
            const visible = visibleBottom - visibleTop;

            const height = page.bottom - page.top;

            const perc = visible / height;

            return {...page, perc};

        }

        return view.pages.map(computeCoverage);

    }

}
