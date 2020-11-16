import { Files } from "./Files";
import { Hashcodes } from "./Hashcodes";
import {Fetches} from "./Fetch";

export namespace FetchesTestingCache {

    async function computePath(url: string) {

        await Files.createDirAsync('test')
        await Files.createDirAsync('test/fetch-cache')

        const hashcode = Hashcodes.create(url);

        return `test/fetch-cache/${hashcode}.dat`;

    }

    export async function fetch(url: string): Promise<string> {

        const path = await computePath(url);

        const exists = await Files.existsAsync(path);

        if (exists) {
            const buff = await Files.readFileAsync(path);
            return buff.toString()
        } else {

            const response = await Fetches.fetch(url);

            const html = await response.text();
            console.log(`Writing cache path ${path} for URL: ${url}`);
            await Files.writeFileAsync(path, html)
            return html;

        }

    }

}