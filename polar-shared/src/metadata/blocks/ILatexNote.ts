import {IBlock} from "./IBlock";

export type LatexStr = string;

export interface ILatexNote extends IBlock {
    readonly type: 'latex';
    readonly data: LatexStr;
}
