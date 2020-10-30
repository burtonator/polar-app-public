
import {IDocBib} from "polar-shared/src/metadata/IDocBib";

export type CaptureType = '';

export interface BasePageMetadata extends Readonly<IDocBib> {

    readonly url: string;

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
