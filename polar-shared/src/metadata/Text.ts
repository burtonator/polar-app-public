
/**
 * Text mapping of TextType to string for each type of content generated which
 * represents this data.  This allow us to have an HTML version of the content,
 * MARKDOWN version, etc.
 */
export class Text implements IText {

    public TEXT?: string;

    public MARKDOWN?: string;

    public HTML?: string;

}

export interface IText {

    TEXT?: string;

    MARKDOWN?: string;

    HTML?: string;

}

export type ITextLike = string | IText;
