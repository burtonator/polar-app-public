import {
    ISODateString,
    ISODateTimeString
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import {EPUBGenerator} from "./EPUBGenerator";

export namespace TemplateLiterals {

    import MediaType = EPUBGenerator.MediaType;

    // TODO support for a cover but we don't need this for now

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
    <meta name="dtb:depth" content="0"/>
    <meta name="dtb:generator" content="Polar EPUB Generator"/>
    <meta name="dtb:totalPageCount" content="<%= totalPageCount %>"/>
    <meta name="dtb:maxPageNumber" content="<%= maxPageNumber %>"/>
  </head>
  <docTitle>
    <text><%= title %></text>
  </docTitle>
  
  <navMap>
    <% pages.forEach(function(page){ %>

    <navPoint id="np-<%= page.playOrder %>" playOrder="<%= page.playOrder %>">
      <navLabel>
        <text><%= page.label %></text>
      </navLabel>
      <content src="<%= page.src %>"/>
    </navPoint>

    <% }); %>

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
