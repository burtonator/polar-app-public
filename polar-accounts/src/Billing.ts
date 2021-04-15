/**
 * Various functions and types around billing.
 */
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

export interface Trial {
    readonly started: ISODateTimeString;
    readonly expires: ISODateTimeString;
}

export namespace Billing {

    export type V1Plan = 'free' | 'bronze' | 'silver' | 'gold';

    export type V2PlanLevel = 'free' | 'plus' | 'pro';

    export interface V2Plan {
        readonly ver: 'v2',
        readonly level: V2PlanLevel;
    }

    export type Plan = V1Plan | V2Plan;

    /**
     * Like a plan but can be V1, V2 or a V2 level string.
     */
    export type PlanLike = V1Plan | V2Plan | Billing.V2PlanLevel;

    export type Interval = 'month' | 'year' | '4year';

    /**
     * A subscription is a plan with an interval (month or year) so that we
     * know the duration of how often it's charged.
     */
    export interface Subscription {

        readonly plan: Plan;

        readonly interval: Interval;

        /**
         * When the user has started a trial we set this with the metadata for
         * the trial.
         */
        readonly trial?: Trial;

    }

    export interface V2Subscription {
        readonly plan: V2Plan;
        readonly interval: Interval;
    }

    export const V2PlanFree: V2Plan = {
        ver: 'v2',
        level: 'free'
    }

    export const V2PlanPlus: V2Plan = {
        ver: 'v2',
        level: 'plus'
    }

    export const V2PlanPro: V2Plan = {
        ver: 'v2',
        level: 'pro'
    }

}
