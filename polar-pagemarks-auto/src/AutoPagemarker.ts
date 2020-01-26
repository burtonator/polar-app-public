/**
 * Takes a set of computed visibilities, then determines where to place the pagemarks.
 */
import {ViewVisibilityCalculator, PageVisibility, ViewVisibility} from "./ViewVisibilityCalculator";
import {UnixTimeMS} from "polar-shared/src/metadata/ISODateTimeStrings";

const MIN_DURATION = 15 * 1000;

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
 * init: there was no previous position so we just initialized it.
 *
 * early: we haven't been on a spot long enough for it to be considered 'reading'
 *        and so we skipped this update.
 *
 * jumped: We jumped around the page and didn't scroll forward on a page.
 *
 * created: a new pagemark was created and emitted.
 *
 * no-pages: no pages were visible.  I practice this should never happen though.
 */
export type ComputeStrategy = 'init' | 'early' | 'jumped' | 'created' | 'no-pages';

export interface ComputeResult {
    readonly strategy: ComputeStrategy;
    readonly position: Position | undefined;
    readonly pagemarked: number | undefined;
}


export type CreatePagemarkCallback = (page: PageID) => void;

export class AutoPagemarker {

    private position?: Position;

    constructor(private callback: CreatePagemarkCallback) {
    }

    public compute(curr: ViewVisibility): ComputeResult {

        const now = Date.now();

        const visible = ViewVisibilityCalculator.visible(curr.visibilities);

        const createResult = (strategy: ComputeStrategy,
                              pagemarked: number | undefined): ComputeResult => {

            const position: Position | undefined
                = this.position ? {...this.position} : undefined;

            return {
                strategy,
                position,
                pagemarked
            };

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

            return updatePosition('init');

        }

        if ((now - this.position.created) < MIN_DURATION) {
            // FIXME: what happens if we jump to early and scroll around..., then stop, and start
            // scrolling normally.
            return updatePosition('early');
        }

        const prevPageID = (this.position.pageVisibility.id);

        if ((pageVisibility.id - 1) === prevPageID) {
            // we have advanced one page exactly and the previous page
            // is now moved forward.
            this.callback(prevPageID);
            return updatePosition('created', prevPageID);

        } else {
            this.position = undefined;
            return updatePosition('jumped');
        }

    }

}
