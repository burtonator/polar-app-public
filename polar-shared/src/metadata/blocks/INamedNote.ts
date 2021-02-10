import {IBlock} from "./IBlock";

/**
 * A note that's just a name like like a wikipedia note.
 */
export interface INamedNote extends IBlock {
    readonly type: 'name';
    readonly value: string;
}
