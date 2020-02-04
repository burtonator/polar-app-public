import {createPatch} from 'diff';

export class Diffs {

    public static compute(before: string, after: string): string {
        return createPatch('patch.txt', before, after, undefined, undefined, {ignoreWhitespace: true});
    }

}
