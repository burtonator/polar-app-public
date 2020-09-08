import {Billing} from "./Billing";

export namespace Plans {

    import V2Plan = Billing.V2Plan;
    import V2PlanFree = Billing.V2PlanFree;
    import V2PlanPlus = Billing.V2PlanPlus;
    import V2PlanPro = Billing.V2PlanPro;

    /**
     * Convert a plan to a V2 plan
     */
    export function toV2(plan: Billing.Plan): V2Plan {

        if (typeof plan === 'string') {
            switch (plan) {
                case "free":
                    return V2PlanFree;
                case "bronze":
                    return V2PlanPlus;
                case "silver":
                    return V2PlanPlus;
                case "gold":
                    return V2PlanPro;
            }
        }

        return plan;

    }

    /**
     * Convert plans to integers so they can be compared.
     */
    export function toInt(plan: Billing.Plan) {

        const v2Plan = toV2(plan);

        switch (v2Plan.level) {
            case "free":
                return 0;
            case "plus":
                return 1;
            case "pro":
                return 2;
        }

    }

    /**
     * Return true if the required plan level is ok vs the actual plan level.
     */
    export function hasLevel(required: Billing.Plan, actual: Billing.Plan) {
        return this.toInt(required) <= this.toInt(actual);
    }

}
