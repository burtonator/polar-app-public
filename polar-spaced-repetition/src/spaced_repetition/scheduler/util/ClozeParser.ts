export class ClozeParser {

    public static parse(input: string) {

        const regex = /{{c([0-9]+)::(.*)}}/g;
        const matches = this.matches(input, regex);

        // TODO: I need a way to take the text , reliably, and occlude the clozes...

    }

    private static matches(text: string, re: RegExp): ReadonlyArray<RegExpExecArray> {

        let m;

        const matches: RegExpExecArray[] = [];

        do {
            m = re.exec(text);
            if (m) {
                matches.push(m);
            }
        } while (m);

        return matches;

    }

}

interface Cloze {

    readonly text: string;

    /**
     * The occluded text that should be initially hidden.
     */
    readonly occluded: string;

    readonly offset: number;

    readonly length: number;

}


// “Is Your {{c1::Startup}} Idea Taken?” — And WHy We Love X For Y {{c2::Startups}}
