import {Billing} from "./Billing";
import {PlanLevels} from "./PlanLevels";

export namespace Plans {

    import V2Plan = Billing.V2Plan;
    import V2PlanFree = Billing.V2PlanFree;
    import V2PlanPlus = Billing.V2PlanPlus;
    import V2PlanPro = Billing.V2PlanPro;

    /**
     * Convert a plan to a V2 plan
     */
    export function toV2(plan: Billing.Plan | undefined): V2Plan {

        if (plan === undefined) {
            return V2PlanFree;
        }

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

        return PlanLevels.toInt(v2Plan.level);

    }

    /**
     * Return true if the required plan level is ok vs the actual plan level.
     */
    export function hasLevel(required: Billing.V2PlanLevel, actual: Billing.Plan) {
        return this.toInt(required) <= this.toInt(actual);
    }

}
