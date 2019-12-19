export namespace accounts {

    export type Plan = 'free' | 'bronze' | 'silver' | 'gold';

    export type Interval = 'month' | 'year';

    export interface Subscription {
        readonly plan: Plan;
        readonly interval: Interval;
    }

}

