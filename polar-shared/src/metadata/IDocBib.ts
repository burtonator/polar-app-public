import {IDocAuthor} from "./IDocAuthor";


export interface IDocBibMutable {

    /**
     * The title for the document.
     */
    title?: string;

    shortTitle?: string;

    /**
     * The subtitle for the document.
     */
    subtitle?: string;

    /**
     * The description for the document.
     */
    description?: string;

    volume?: string;

    issn?: string;

    isbn?: string;

    editor?: string;

    address?: string;

    edition?: string;

    doi?: string;

    abstract?: string;

    lang?: string;

    journal?: string;

    month?: string;
    year?: string;

    pmid?: string;

    keywords?: ReadonlyArray<string>;

    pages?: string;

    authors?: ReadonlyArray<IDocAuthor>;

    publisher?: string;

    copyright?: string;

}

export interface IDocBib extends Readonly<IDocBibMutable> {

}
