/**
 * Takes a set of computed visibilities, then determines where to place the pagemarks.
 */
import {PageVisibility, ViewVisibility, ViewVisibilityCalculator} from "./ViewVisibilityCalculator";
import {UnixTimeMS} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Logger} from "polar-shared/src/logger/Logger";
import {Percentage100} from "polar-shared/src/util/Percentages";
import {DurationMS} from "polar-shared/src/util/TimeDurations";

const log = Logger.create();

/**
 * A page ID greater than 1.
 */
export type PageID = number;

/**
 * The position of our reading on the last scroll.  The position is reset if we jump
 * too far to be a reasonable reading and not just a jump to another part of the
 * document.
 */
export interface Position {

    readonly pageVisibility: PageVisibility;

    /**
     * Where we first jumped so that we don't create a pagemark from page zero
     * all the way to the current page if we jumped from the beginning.
     */
    readonly origin: PageID;

    /**
     * The timestamp of the last position on scroll.
     */
    readonly created: UnixTimeMS;

    /**
     * The last time we were updated.
     */
    readonly updated: UnixTimeMS;

}

/**
 * The strategy used within the compute (for testing primarily)
 *
 * init: there was no previous position so we just initialized it.  This is done
 *       on startup.
 *
 * early: we haven't been on a spot long enough for it to be considered 'reading'
 *        and so we skipped this update and just defined the position for next
 *        time.
 *
 * jumped: We jumped around the page and didn't scroll forward on a page.
 *
 * created: a new pagemark was created and emitted.
 *
 * updated: We scrolled but the page wasn't advanced enough to make a change.
 *
 * no-pages: no pages were visible.  I practice this should never happen though.
 */
export type ComputeStrategy = 'init' | 'early' | 'jumped' | 'created' | 'updated' | 'no-pages';

export interface ComputeResult {
    readonly strategy: ComputeStrategy;
    readonly position: Position | undefined;
    readonly pagemarked: number | undefined;
}

export interface ExtendPagemark {
    readonly origin: PageID;
    readonly page: PageID;
    readonly perc: Percentage100;
}

export type CreatePagemarkCallback = (extendPagemark: ExtendPagemark) => void;

/**
 * Some document formats like HTML and ePub essentially have LONG pages.
 */
export type AutoPagemarkerMode = 'full' | 'partial';

/**
 * Number of pixels as an integer.
 */
export type Pixels = number;

export interface AutoPagemarkerOpts {
    readonly mode: AutoPagemarkerMode;
    readonly minDuration: DurationMS;
    readonly minPagemarkHeight: Pixels;
}

const DEFAULT_OPTS: AutoPagemarkerOpts = {
    mode: 'full',
    minDuration: 30 * 1000,
    minPagemarkHeight: 200
};

export class AutoPagemarker {

    private position?: Position;

    private readonly opts: AutoPagemarkerOpts;

    constructor(private callback: CreatePagemarkCallback,
                opts: Partial<AutoPagemarkerOpts> = {}) {

        this.opts = {
            mode: opts.mode || DEFAULT_OPTS.mode,
            minDuration: opts.minDuration || DEFAULT_OPTS.minDuration,
            minPagemarkHeight: opts.minPagemarkHeight || DEFAULT_OPTS.minPagemarkHeight
        };

    }

    public compute(viewVisibility: ViewVisibility): ComputeResult {

        const now = Date.now();

        const visible = ViewVisibilityCalculator.visible(viewVisibility.visibilities);

        const createResult = (strategy: ComputeStrategy,
                              pagemarked: number | undefined): ComputeResult => {

            const position: Position | undefined
                = this.position ? {...this.position} : undefined;

            const result = {
                strategy,
                position,
                pagemarked
            };

            console.debug("Auto pagemarker result: ", result);

            return result;

        };

        if (visible.length === 0) {
            console.warn("Nothing visible");
            return createResult('no-pages', undefined);
        }

        const pageVisibility = visible[0];

        const updatePosition = (strategy: ComputeStrategy,
                                pagemarked: number | undefined = undefined): ComputeResult => {

            if (this.position) {

                this.position = {
                    ...this.position,
                    pageVisibility,
                    updated: now,
                };

            } else {

                this.position = {
                    origin: pageVisibility.id,
                    pageVisibility,
                    created: now,
                    updated: now
                };

            }

            return createResult(strategy, pagemarked);

        };

        if (this.position === undefined) {
            
            // if the current position is undefined, then we've just started
            // and so there's nothing left to do

            console.debug("init");
            return updatePosition('init');

        }

        if ((now - this.position.created) < this.opts.minDuration) {
            log.debug("early: ", this.opts.minDuration);
            return updatePosition('early');
        }

        const prevPageID = (this.position.pageVisibility.id);
        const currPageID = pageVisibility.id;

        interface Coverage {
            readonly perc: Percentage100;
            readonly state: 'created' | 'updated' | 'jumped';
        }

        // there are really only three states 'none' | 'paged' or 'jumped'

        /**
         * Compute what percentage of the page is covered and whether we should emit.
         */
        const computeCoverage = (): Coverage => {

            // FIXME: use the viewVisibility along with this.position to recompute
            // the pagemarks from this point.

            switch (this.opts.mode) {

                case "full":

                    // for the PDF viewer only cover pages that are no longer in
                    // view.

                    if ((currPageID - 1) === prevPageID) {
                        return {
                            state: 'created',
                            perc: 100
                        };
                    } else if (currPageID === prevPageID) {

                        return {
                            state: 'updated',
                            perc: 100
                        };

                    } else {
                        return {
                            state: 'jumped',
                            perc: 0
                        };
                    }

                case "partial":

                    // this is used in the HTML viewer (and the future ePub viewer)
                    // and since it only has one page we just adjust the coverage
                    // to be JUST up to the beginning of the viewport.

                    // then map these back into the original percentage of page
                    // model.

                    // TODO how do I compare this to the viewport size? if the page
                    // is zoomed in/out?

                    // TODO a simpler way to do this could be to take the current
                    // viewport height, take 20 of this, break the 'page' up into
                    // chunks (like pages) and then map them back to the original

                    const height = viewVisibility.viewport.bottom - viewVisibility.viewport.top;

                    // FIXME register with something like (prevous move > 30s ago and jump is <= 100 % of viewport height then
                    // set the previous page to 100% of height... JUST below the current fold... just call
                    // currentePagemarkToPoint

                    // FIXME: use  pageVisibility.perc to determine which 'page' is marked...
                    //
                    // map BACK ot the original??

                    // FIXME: maybe I can do this in the view computation code, compute a
                    // CUSTOM view and page size, then allow this engine to work, then I listen
                    // to the 'pages' that are marked and map them BACK to the real pages.

                    // map these to virtual pages from the height of ALL the main page
                    // and compare that to the viewport


                    return {
                        state: 'updated',
                        perc: pageVisibility.perc * 100
                    };

            }

        };

        const coverage = computeCoverage();

        // FIXME: jumped is currently defined as one page BUT the html view is only 1 page so therefore
        // there will never be any 'jumps.  We should consider a jump > 1x of a viewport.
        //
        // FIXME: another issue with HTML mode is that a 'continuation' where we're starting a new pagemark
        // deep down the page needs to be starting at a percentage.

        switch (coverage.state) {

            case "created":
                // we have advanced one page exactly and the previous page
                // is now moved forward.

                this.callback({
                    origin: this.position.origin,
                    page: prevPageID,
                    perc: coverage.perc
                });

                log.debug("Created");

                return updatePosition('created', prevPageID);

            case "updated":
                log.debug("Updated");
                return updatePosition('updated');

            case "jumped":
                log.debug("jumped due to pages: ", {currPageID, prevPageID});

                this.position = undefined;
                return updatePosition('jumped');

        }

    }

}
