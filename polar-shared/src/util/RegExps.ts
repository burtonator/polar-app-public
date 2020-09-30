export namespace RegExps {

    export function escape(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /**
     * Convert all matches to an array so we can use streams on the data.
     */
    export function matches(re: RegExp, text: string): ReadonlyArray<RegExpExecArray> {

        const result: RegExpExecArray[] = [];

        while(true) {

            const match = re.exec(text);
            if (match === null) {
                break;
            }

            result.push(match);

        }

        return result;

    }

}

export type RegexStr = string;
