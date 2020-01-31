import {DOILookup} from "./DOILookup";

xdescribe('DOILookup', function() {

    it("basic", async function() {

        this.timeout(50000);
        const results = await DOILookup.lookup("10.1038/nature12373");
        console.log(JSON.stringify(results, null, "  "));

    });

});

