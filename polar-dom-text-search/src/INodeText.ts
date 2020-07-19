import {CharPointer} from "./CharPointers";

export interface INodeText {
    readonly idx: number;
    readonly node: Node;
    readonly text: string;
    readonly charPointers: ReadonlyArray<CharPointer>;
}
