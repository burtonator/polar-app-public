import {EPUBGenerator} from "../EPUBGenerator";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";

export namespace ContainerOPF {

    import MediaType = EPUBGenerator.MediaType;

    export interface IContent {

        readonly id: URLStr | IDStr;
        readonly title: string;
        readonly source: string;

        readonly creator?: string;
        readonly lang?: string;

        readonly subjects: ReadonlyArray<string>;
        readonly publication?: ISODateTimeString | ISODateString;
        readonly conversion: ISODateTimeString | ISODateString;

        readonly spine: ReadonlyArray<ISpineItem>;

        readonly manifest: ReadonlyArray<IManifestItem>;

        readonly guide: ReadonlyArray<IGuideReference>;

    }

    export interface ISpineItem {
        readonly idref: string;
        readonly linear: 'yes' | 'no';
    }

    export interface IManifestItem {
        readonly id: string;
        readonly href: string;
        readonly mediaType: MediaType;
    }

    export interface IGuideReference {
        readonly type: 'cover' | 'toc';
        readonly title: string;
        readonly href: string;
    }

    export function generate(opts: IContent) {

        function generateSubjects() {

            function toHTML(subject: string): string {
                return `<dc:subject>${subject}</dc:subject>`;
            }

            return opts.subjects.map(toHTML).join("\n");

        }

        function generatePublication() {

            if (opts.publication) {
                return `<dc:date opf:event="publication">${opts.publication}</dc:date>`;
            }

            return "";

        }

        function generateManifestItems(): string {

            function toHTML(manifestItem: IManifestItem) {
                return `<item href="${manifestItem.href}" id="${manifestItem.id}" media-type="${manifestItem.mediaType}"/>`;
            }

            return opts.manifest.map(toHTML).join("\n");

        }

        function generateSpineItems(): string {

            function toHTML(spineItem: ISpineItem) {
                return `<itemref idref="${spineItem.idref}" linear="${spineItem.linear}"/>`;
            }

            return opts.spine.map(toHTML).join("\n");

        }

        function generateGuideReferenceItems(): string {

            function toHTML(guideReferenceItem: IGuideReference) {
                return `<reference type="${guideReferenceItem.type}" title="${guideReferenceItem.title}" href="${guideReferenceItem.href}"/>`;
            }

            return opts.guide.map(toHTML).join("\n");

        }

        const subjects = generateSubjects();
        const publication = generatePublication();
        const manifestItems = generateManifestItems();
        const spineItems = generateSpineItems();
        const guideReferenceItems = generateGuideReferenceItems();

        return `<?xml version='1.0' encoding='UTF-8'?>

<package xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="id">
  <metadata>
    <dc:identifier opf:scheme="URI" id="id">${opts.id}</dc:identifier>
    
    <dc:creator opf:file-as="${opts.creator}">${opts.creator}</dc:creator>
    
    <!-- <dc:contributor opf:role="ctb" opf:file-as=""></dc:contributor> -->
    <dc:title>${opts.title}</dc:title>
    <dc:language xsi:type="dcterms:RFC4646">${opts.lang || 'en'} </dc:language>

    ${subjects}    

    ${publication}
    
    <dc:date opf:event="conversion">${opts.conversion}</dc:date>
    <dc:source>${opts.source}</dc:source>
    <!-- <meta name="cover" content="item1"/> -->
  </metadata>
  <manifest>

    ${manifestItems}  
    
    <item href="toc.ncx" id="ncx" media-type="application/x-dtbncx+xml"/>
    <!-- <item href="wrap0000.html" id="coverpage-wrapper" media-type="application/xhtml+xml"/> -->
    
  </manifest>
  <spine toc="ncx">

    <!-- <itemref idref="coverpage-wrapper" linear="yes"/> -->

    ${spineItems}

  </spine>
  <guide>
    <!-- 
    <reference type="toc" title="CONTENTS" href="@public@vhost@g@gutenberg@html@files@28885@28885-h@28885-h-0.htm.html#pgepubid00002"/>
    <reference type="cover" title="Cover" href="wrap0000.html"/>
    -->

    ${guideReferenceItems}

  </guide>
</package>
`
    }
}
