import {PDFMetadata} from './PDFMetadata';
import {Files} from '../../../../polar-bookshelf/web/js/util/Files';
import {HitMap, SampledHitMap} from '../../../../polar-bookshelf/web/js/util/HitMap';
import {Strings} from '../../../../polar-bookshelf/web/js/util/Strings';
import {DOIs} from './DOIs';

describe('PDF Metadata', function() {
    this.timeout(999999);

    xit("basic", async function() {
        const pdfMeta = await PDFMetadata.getMetadata("/home/burton/Downloads/SSRN-id2594754.pdf");

        console.log(pdfMeta);
    });

    xit("build property index", async function() {

        const hitMap = new SampledHitMap<string>();

        let nrFiles: number = 0;

        await Files.recursively("/d0/polar-pdf-set", async (path) => {

            if ( ! path.endsWith(".pdf")) {
                return;
            }

            console.log(path);

            const pdfMeta = await PDFMetadata.getMetadata(path);

            for (const propKey of Object.keys(pdfMeta.props)) {
                const propValue = pdfMeta.props[propKey];
                hitMap.registerHit(propKey, propValue);
            }

            const toDOI = () => {

                const toDOIWithProp = (prop: string): string | undefined => {

                    if (pdfMeta.props[prop]) {
                        return prop;
                    }

                    return undefined;

                };

                const toDOIWithPropContainsValue = (prop: string, value: string): string | undefined => {

                    if (pdfMeta.props[prop] && pdfMeta.props[prop].indexOf(value) !== -1) {
                        return prop;
                    }

                    return undefined;

                };

                const toDOIWithPropStartsWithValue = (prop: string, value: string): string | undefined => {

                    if (pdfMeta.props[prop] && pdfMeta.props[prop].startsWith(value)) {
                        return prop;
                    }

                    return undefined;

                };

                return [
                        toDOIWithProp("prism:doi"),
                        toDOIWithProp("crossmark:doi"),
                        toDOIWithProp("pdfx:doi"),
                        toDOIWithProp("pdfx:wps-articledoi"),
                        toDOIWithPropStartsWithValue("dc:identifier", "doi:"),
                        toDOIWithPropContainsValue("prism:url", "doi.org"),
                        toDOIWithPropContainsValue("dc:title", "doi:"),
                        toDOIWithPropContainsValue("dc:description", "doi:")
                        ]
                    .filter(current => current !== undefined);

            };

            const doiMappings = toDOI();

            const doi = DOIs.toDOI(pdfMeta.props);

            if (doiMappings.length >= 1) {
                hitMap.registerHit("__DOI__", doiMappings[0]!);
            }

            if (doi) {
                hitMap.registerHit("__PARSED_DOI__", "true");
            }

            for (const doiMapping of doiMappings) {
                hitMap.registerHit("__DOI:" + doiMapping!, "true");
            }

            ++nrFiles;

        });

        const nrSamples = 10;

        const percRanked = hitMap.toPercRanked(nrSamples, nrFiles);

        for (const current of percRanked) {

            const strIdx = Strings.lpad(current.idx, ' ', 4);
            const strKey = Strings.lpad(current.key, ' ', 50);
            const strPerc = Strings.lpad(current.perc, ' ', 4);
            const strHits = Strings.lpad(current.hits, ' ', 10);
            const samples = current.samples.join(", ").substring(0, 120).replace(/\n/g, ".");

            console.log(`${strIdx} ${strKey} ${strPerc} ${strHits} : ${samples}`);

        }

        // console.log("printing result");
        // console.log(hitMap.toRanked());

    });

});
