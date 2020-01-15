

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

export interface Book {
    readonly viewport: Viewport;
    readonly pages: ReadonlyArray<Page>;
}

export class AutoPagemarkCalculator {

    public static calculate(book: Book) {

        function computeCoverage(page: Page): PageVisibility {

            const visibleBottom = Math.min(page.bottom, book.viewport.bottom);
            const visibleTop = Math.max(page.top, book.viewport.top);
            const visible = visibleBottom - visibleTop;

            const height = page.bottom - page.top;

            const perc = visible / height;

            return {...page, perc};

        }

        return book.pages.map(computeCoverage);

    }

}
