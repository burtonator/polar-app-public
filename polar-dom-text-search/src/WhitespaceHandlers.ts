import {arrayStream, ScanTuple} from "polar-shared/src/util/ArrayStreams";
import { Strings } from "polar-shared/src/util/Strings";

export namespace WhitespaceHandlers {

    export type ScanDirection = 'start' | 'end';

    export function computeWhitespaceTerminator(text: string,
                                                direction: ScanDirection): number | undefined {

        function computeStartAndDelta() {

            switch(direction) {
                case "start":
                    return [0, 1];
                case "end":
                    return [text.length -1, -1];
            }

        }

        const [start, delta] = computeStartAndDelta();

        interface IScanned {
            readonly idx: number;
            readonly isWhitespace: boolean;
        }

        function scanner(c: string, idx: number): ScanTuple<IScanned> {
            const isWhitespace = Strings.isWhitespace(c);
            return [{idx, isWhitespace}, isWhitespace];
        }

        return arrayStream(Array.from(text))
            .scan(start, delta, scanner)
            .filter(current => ! current.isWhitespace)
            .map( current => current.idx)
            .last();

    }

    /**
     * Create a function that returns true when the text is whitespace.
     */
    export function createWhitespacePredicate(text: string) {

        if (text === '') {
            return () => false;
        }

        const start = computeWhitespaceTerminator(text, 'start');
        const end = computeWhitespaceTerminator(text, 'end')!;

        return (idx: number): boolean => {

            if (start === undefined) {
                // the whole string is whitespace
                return true;
            }

            // regular text idx should be within [start, end] (interval notation)
            return idx < start || idx > end;

        };

    }

}
