import Readability from "readability";
import {ConstructorOptions, JSDOM} from "jsdom";
import {FetchesTestingCache} from "polar-shared/src/util/FetchesTestingCache";

describe('Readability', function () {

    function parseHTML(html: string, url: string) {
        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM(html, opts);
        return dom.window.document;
    }

    it("basic", async function () {

        const url = 'https://www.bunniestudios.com/blog/?p=5971';
        const html = await FetchesTestingCache.fetch(url);

        const doc = parseHTML(html, url)

        console.log(process.cwd());

        const readability = new Readability(doc);
        const readable = readability.parse();

        // TODO this isn't working because I'm getting the result of:
        // <div id="readability-page-1" class="page">[object Promise]</div>
        //
        // so maybe promise aren't working in readability.

        console.log("title: " + readable.title);
        console.log("content: \n" + readable.content);

    });

});
