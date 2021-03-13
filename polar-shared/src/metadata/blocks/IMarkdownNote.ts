import {IBlock, NoteTargetStr} from "./IBlock";

/**
 * A regular note with markdown content.
 */
export interface IMarkdownNote extends IBlock {

    readonly type: 'markdown';

    readonly value: string;

    /**
     * Links to other notes based on the wiki links in the markdown content.
     */
    readonly links: ReadonlyArray<NoteTargetStr>;

}
