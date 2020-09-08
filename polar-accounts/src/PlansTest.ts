import {assertJSON} from "polar-test/src/test/Assertions";
import {Plans} from "./Plans";
import {Billing} from "./Billing";
import V2PlanFree = Billing.V2PlanFree;
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;

describe('Plans', function() {

    it("toV2", function() {

        assertJSON(Plans.toV2('free'), {
            "level": "free",
            "ver": "v2"
        });

        assertJSON(Plans.toV2('bronze'), {
            "level": "plus",
            "ver": "v2"
        });

        assertJSON(Plans.toV2('silver'), {
            "level": "plus",
            "ver": "v2"
        });

        assertJSON(Plans.toV2('gold'), {
            "level": "pro",
            "ver": "v2"
        });

        assertJSON(Plans.toV2(V2PlanFree), {
            "level": "free",
            "ver": "v2"
        });

        assertJSON(Plans.toV2(V2PlanPlus), {
            "level": "plus",
            "ver": "v2"
        });

        assertJSON(Plans.toV2(V2PlanPro), {
            "plan": "pro",
            "ver": "v2"
        });

    });

});
