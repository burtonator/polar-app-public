import {Billing} from "./Billing";

export namespace PlanLevels {

    export function toV2(plan: Billing.V1Plan | Billing.V2PlanLevel): Billing.V2PlanLevel {

        switch (plan) {
            case "free":
                return 'free';
            case "bronze":
                return 'plus';
            case "silver":
                return 'plus';
            case "gold":
                return 'pro';
        }

        return plan;

    }

    export function toInt(planLevel: Billing.V2PlanLevel) {

        switch (planLevel) {
            case "free":
                return 0;
            case "plus":
                return 1;
            case "pro":
                return 2;
        }

    }

}
