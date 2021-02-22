
import {IDocBib} from "polar-shared/src/metadata/IDocBib";
import { ISODateTimeString } from "polar-shared/src/metadata/ISODateTimeStrings";

export type CaptureType = '';

export interface BasePageMetadata extends Readonly<IDocBib> {

    readonly url: string;
    readonly epubURL?: string;
    readonly date?: ISODateTimeString;

}

export interface PageMetadataForPDF extends BasePageMetadata {

    /**
     * The PDF document URL for downloading the PDF.
     */
    readonly pdfURL: string;

}

export interface PageMetadataForWebContent extends BasePageMetadata {

}

export type PageMetadata = PageMetadataForPDF | PageMetadataForWebContent;
