import {Reducers} from 'polar-shared/src/util/Reducers';
import {Filters} from 'polar-shared/src/util/Filters';
import {PDFProps} from "./PDFProps";

export class DOIs {

    private static isDOI(value: string): boolean {
        return value.match(/^10\.[^/]+\/[^/]+/g) !== null;
    }

    private static prefixedDOI(value: string,
                               prefix: string,
                               newPrefix: string = ""): DOI | undefined {

        if (value.startsWith(prefix)) {
            value = newPrefix + value.substring(prefix.length);

            if (this.isDOI(value)) {
                return value;
            }

        }

        return undefined;

    }

    public static parseDOI(value: string): DOI | undefined {

        return [this.prefixedDOI(value, 'doi:10.', '10.'),
                this.prefixedDOI(value, 'http://dx.doi.org/10.', '10.'),
                this.prefixedDOI(value, 'https://dx.doi.org/10.', '10.'),
                this.prefixedDOI(value, 'http://doi.org/10.', '10.'),
                this.prefixedDOI(value, 'https://doi.org/10.', '10.')]
            .filter(Filters.PRESENT)
            .reduce(Reducers.FIRST, undefined)
        ;

    }

    public static toDOI(props: PDFProps): DOI | undefined {

        return [props['crossmark:doi'],
                props['pdfx:doi'],
                props['prism:doi'],
                props['prism:url'],
                props['pdfx:wps-articledoi'],
                props['xap:identifier'],
                props['dc:identifer'],
                props['dc:title'],
                props['dc:description']]
            .filter(Filters.PRESENT)
            .map(current => this.parseDOI(current))
            .filter(Filters.PRESENT)
            .reduce(Reducers.FIRST, undefined)
        ;

    }

}

export type DOI = string;
