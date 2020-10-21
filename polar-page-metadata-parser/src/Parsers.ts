import {Parser} from "./Parser";
import {ARXIVParser} from "./parsers/ARXIVParser";

namespace Parsers {

    /**
     *
     * Create a parser for each URL given
     */
    export function create(url: string): Parser | undefined {
        // mapping of parsers

        if (url.startsWith("https://arxiv.org/")) {
            return new ARXIVParser();
        }

        return undefined;

    }
}

