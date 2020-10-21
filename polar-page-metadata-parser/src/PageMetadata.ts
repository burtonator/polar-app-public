
// TODO:
// this should have roughly the same metadata as IDocBib in
//     polar-app-public/polar-shared/src/metadata/IDocBib.ts
//
// and we can probably just extend this class with PageMetadata which will allow
// us to put EXTRA fields in PageMetadata if necessary

export interface PageMetadata {

    readonly url: string;
    readonly pdfURL: string;

    readonly title?: string;
    readonly authors?: ReadonlyArray<string>;
    readonly summary?: string;

}

