import {IPointer, IPointerBase, PointerType} from "./IPointer";
import {Whitespace} from "./Whitespace";

export namespace CharPointers {

    export function parse(text: string): ReadonlyArray<IPointerBase> {

        const whitespacePredicate = Whitespace.createWhitespacePredicate(text);

        function toCharPointer(c: string, idx: number): IPointerBase {

            function computeType(): PointerType {

                if (whitespacePredicate(idx)) {
                    return PointerType.ExcessiveWhitespace;
                }

                return PointerType.Literal;

            }

            const type = computeType();

            return {
                type,
                value: c,
                offset: idx,
            };

        }

        return Array.from(text)
                    .map(toCharPointer)

    }

    export function toPointers(nodeID: number,
                               node: Node,
                               charPointers: ReadonlyArray<IPointerBase>): ReadonlyArray<IPointer> {

        function toPointer(charPointer: IPointerBase): IPointer {
            return {nodeID, node, ...charPointer};
        }

        return charPointers.map(toPointer);

    }

}
