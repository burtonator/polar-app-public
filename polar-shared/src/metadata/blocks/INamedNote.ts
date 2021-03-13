import {IBlock} from "./IBlock";

/**
 * A note that's just a name like like a wikipedia note and does not allow
 * complex data in it like bold, etc.
 */
export interface INamedNote extends IBlock {
    readonly type: 'name';
    readonly value: string;
}
