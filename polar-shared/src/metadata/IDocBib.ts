import {IDocAuthor} from "./IDocAuthor";
import {IJournal} from "./IDocDetail";

export type ReadonlyArrayMap<V> = Readonly<{[key: number]: V}>;

export type Month = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

/**
 * Mutable interface for bibliographic metadata on a document
 */
export interface IDocBibMutable {

    /**
     * The title for the document.
     */
    title?: string;

    /**
     * Included in some versions of bibtex.
     */
    shortTitle?: string;

    /**
     * The subtitle for the document.
     */
    subtitle?: string;

    /**
     * The description for the document.
     */
    description?: string;

    /**
     * The volume of a journal or multivolume book.
     */
    volume?: string;

    issn?: string;

    isbn?: string;

    editor?: string | ReadonlyArrayMap<string>;

    address?: string;

    edition?: string;

    /**
     * The DOI (document identifier) for this document.  This is either provided
     * by the user or found via metadata when adding the PDF.
     */
    doi?: string;

    /**
     * The abstract or summary of the document as provided by the author of the paper.
     */
    abstract?: string;

    lang?: string;

    journal?: string | IJournal;

    month?: Month | string;

    /**
     * The year the document was published. This needs to be a string because some publishers use
     * time ranges like '1992-1994' or '1992, 1993, 1994'
     */
    year?: string;

    /**
     * The PubMed ID for this document.
     */
    pmid?: string;

    /**
     * The keywords that are defined by the publisher for this document.
     */
    keywords?: ReadonlyArrayMap<string>;

    pages?: string;

    authors?: ReadonlyArrayMap<string> | ReadonlyArrayMap<IDocAuthor>;

    /**
     * The name of the publisher for this document.  This is the name of the
     * academic journal, newspaper, website, etc.
     */
    publisher?: string;

    copyright?: string;

}

export interface IDocBib extends Readonly<IDocBibMutable> {

}
