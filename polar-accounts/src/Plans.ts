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
    export function toV2(plan: Billing.PlanLike | undefined): V2Plan {

        if (plan === undefined) {
            return V2PlanFree;
        }

        if (typeof plan === 'string') {

            switch(plan) {
                case "plus":
                    return V2PlanPlus;
                case "pro":
                    return V2PlanPro;
            }

            switch (plan) {
                // v1
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
    export function toInt(plan: Billing.Plan | Billing.V2PlanLevel) {

        const v2Plan = toV2(plan);

        return PlanLevels.toInt(v2Plan.level);

    }

    export function max(plan0: Billing.V2Plan, plan1: Billing.V2Plan): V2Plan {

        const planLevel0 = toInt(plan0);
        const planLevel1 = toInt(plan1);

        if (planLevel0 > planLevel1) {
            return plan0;
        } else {
            return plan1;
        }

    }

    /**
     * Return true if the required plan level is ok vs the actual plan level.
     */
    export function hasLevel(required: Billing.V2PlanLevel, actual: Billing.Plan) {

        const nRequired = toInt(required);
        const nActual = toInt(actual);

        return nRequired <= nActual;

    }

}

