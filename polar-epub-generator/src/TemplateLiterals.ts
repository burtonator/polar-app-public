import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import {EPUBGenerator} from "./EPUBGenerator";

export namespace TemplateLiterals {

    import MediaType = EPUBGenerator.MediaType;
    /**
     * The container file written to /META-INF/container.xml
     */
    export const CONTAINER =
`<?xml version='1.0' encoding='utf-8'?>
<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
`

    export interface IContent {
        readonly id: URLStr | IDStr;
        readonly title: string;
        readonly source: string;

        readonly creator?: string;
        readonly lang?: string;

        readonly subjects: ReadonlyArray<string>;
        readonly publication?: ISODateTimeString | ISODateString;
        readonly conversion?: ISODateTimeString | ISODateString;

        readonly spine: ReadonlyArray<ISpineItem>;

        readonly manifest: ReadonlyArray<IManifestItem>;

        readonly guide: ReadonlyArray<IGuideReference>;

    }

    export interface ISpineItem {
        readonly idref: string;
        readonly linear?: boolean;
    }

    export interface IManifestItem {
        readonly id: string;
        readonly href: string;
        readonly mediaType: MediaType;
    }

    interface IGuideReference {
        readonly type: 'cover' | 'toc';
        readonly title: string;
        readonly href: string;
    }

    // TODO support for a cover but we don't need this for now

    /**
     * The content file written to OEBPS/content.opf
     */
    export const CONTENT_OPF =
`<?xml version='1.0' encoding='UTF-8'?>

<package xmlns:opf="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="id">
  <metadata>
    <dc:identifier opf:scheme="URI" id="id"><%= id %></dc:identifier>
    
    <dc:creator opf:file-as="<%= creator %>"><%= creator %></dc:creator>
    
    <dc:contributor opf:role="ctb" opf:file-as="Dobson, Austin">Austin Dobson</dc:contributor>
    <dc:contributor opf:role="ill" opf:file-as="Rackham, Arthur">Arthur Rackham</dc:contributor>
    <dc:title><%= title %></dc:title>
    <dc:language xsi:type="dcterms:RFC4646"><%= lang || 'en' %> </dc:language>
    
    <% subjects.forEach(function(subject){ %>
    <dc:subject><%= subject %></dc:subject>
    <% }); %>

    <dc:date opf:event="publication"><%= publication %></dc:date>
    <dc:date opf:event="conversion"><%= conversion %></dc:date>
    <dc:source><%= source %></dc:source>
    <!-- <meta name="cover" content="item1"/> -->
  </metadata>
  <manifest>
  
    <% manifest.forEach(function(manifestItem){ %>
    <item href="<%= manifestItem.href %>" id="<%= manifestItem.id %>" media-type="<%= manifestItem.mediaType %>"/>
    <% }); %>
    
    <item href="toc.ncx" id="ncx" media-type="application/x-dtbncx+xml"/>
    <!-- <item href="wrap0000.html" id="coverpage-wrapper" media-type="application/xhtml+xml"/> -->
    
  </manifest>
  <spine toc="ncx">

    <!-- <itemref idref="coverpage-wrapper" linear="yes"/> -->

    <% spine.forEach(function(spineItem){ %>
    <itemref idref="<%= spineItem.idref %>" linear="<%= spineItem.linear ? 'yes' | 'no' %>"/>
    <% }); %>

  </spine>
  <guide>
    <!-- 
    <reference type="toc" title="CONTENTS" href="@public@vhost@g@gutenberg@html@files@28885@28885-h@28885-h-0.htm.html#pgepubid00002"/>
    <reference type="cover" title="Cover" href="wrap0000.html"/>
    -->

    <% guide.forEach(function(guideItem){ %>
    <reference type="<%= guideItem.type %>" title="<%= guideItem.title %>" href="<%= guideItem.href %>"/>
    <% }); %>

  </guide>
</package>
`

    export type UIDStr = string;

    export interface ITOC {
        readonly uid: UIDStr;
        readonly title: string;
        readonly totalPageCount: number;
        readonly maxPageNumber: number;

        readonly pages: ReadonlyArray<IPage>

    }

    export interface IPage {
        readonly playOrder: number;
        readonly label: string;
        readonly src: string;
    }

    export const TOC_NCX = `<?xml version='1.0' encoding='UTF-8'?>

<!DOCTYPE ncx PUBLIC '-//NISO//DTD ncx 2005-1//EN' 'http://www.daisy.org/z3986/2005/ncx-2005-1.dtd'>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en">
  <head>
    <meta name="dtb:uid" content="<%= uid %>"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:generator" content="Polar EPUB Generator"/>
    <meta name="dtb:totalPageCount" content="<%= totalPageCount %>"/>
    <meta name="dtb:maxPageNumber" content="<%= maxPageNumber %>"/>
  </head>
  <docTitle>
    <text><%= title %></text>
  </docTitle>
  
  <navMap>
  </navMap>
  
  <pageList id="pages" class="pagelist">
  
    <navLabel>
      <text>Pages</text>
    </navLabel>
    
    <% pages.forEach(function(page){ %>

    <pageTarget id="pt-<%= page.playOrder %>" value="<%= page.playOrder %>" type="front" playOrder="<%= page.playOrder %>">
      <navLabel>
        <text><%= page.label %></text>
      </navLabel>
      <content src="<%= page.src %>"/>
    </pageTarget>

    <% }); %>
       
  </pageList>
</ncx>
`;
}
