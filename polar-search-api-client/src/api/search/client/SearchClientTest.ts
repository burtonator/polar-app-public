import {SearchClient} from "./SearchClient";


xdescribe('SearchClient', function() {

    it("basic", async function() {
        this.timeout(50000);
        const results = await SearchClient.exec({q: 'bitcoin', target: 'arxiv'});

        console.log(JSON.stringify(results, null, "  "));

    });

});
