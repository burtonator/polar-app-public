import {RegexStr, RegExps} from "polar-shared/src/util/RegExps";
import {Whitespace} from "./Whitespace";
import {Mappers} from "polar-shared/src/util/Mapper";

export namespace QueryRegexps {

    export function toRegExp(text: string): RegexStr {

        // \s maps to the same characters we have in Strings.isWhitespace so
        // should work fine but we might want to unify them in the future just
        // in case

        return Mappers.create(text)
            .map(Whitespace.canonicalize)
            .map(RegExps.escape)
            .map(current => current.replace(/\s+/g, '\\s+'))
            .collect()

    }

}
