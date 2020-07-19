import {IPointer} from "./IPointer";

export interface INodeText {
    readonly nodeID: number;
    readonly node: Node;
    readonly text: string;
    readonly pointers: ReadonlyArray<IPointer>;
}
