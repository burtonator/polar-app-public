import {IBlock} from "./IBlock";

export type CodeStr = string;

export interface ICodeNote extends IBlock {
    readonly type: 'code';
    readonly lang: 'typescript' | 'javascript' | 'markdown' | 'java' | string;
    readonly value: CodeStr;
}
