
export namespace TOC_NCX {

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


    export function generate(opts: ITOC) {

        function generateNavMapItems() {

            function toHTML(page: IPage) {
                return `<navPoint id="np-${page.playOrder}" playOrder="${page.playOrder}">
      <navLabel>
        <text>${page.label}</text>
      </navLabel>
      <content src="${page.src}"/>
    </navPoint>`
            }

            return opts.pages.map(toHTML).join("\n");

        }

        function generatePageTargetItems() {

            function toHTML(page: IPage) {
                return `<pageTarget id="pt-${page.playOrder}" value="${page.playOrder}" type="front" playOrder="${page.playOrder}">
      <navLabel>
        <text>${page.label}</text>
      </navLabel>
      <content src="${page.src}"/>
    </pageTarget>`
            }

            return opts.pages.map(toHTML).join("\n");

        }

        const navMapItems = generateNavMapItems();
        const pageTargetItems = generatePageTargetItems();

        return `<?xml version='1.0' encoding='UTF-8'?>

<!DOCTYPE ncx PUBLIC '-//NISO//DTD ncx 2005-1//EN' 'http://www.daisy.org/z3986/2005/ncx-2005-1.dtd'>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en">
  <head>
    <meta name="dtb:uid" content="${opts.uid}"/>
    <meta name="dtb:depth" content="0"/>
    <meta name="dtb:generator" content="Polar EPUB Generator"/>
    <meta name="dtb:totalPageCount" content="${opts.totalPageCount}"/>
    <meta name="dtb:maxPageNumber" content="${opts.maxPageNumber}"/>
  </head>
  <docTitle>
    <text>${opts.title}</text>
  </docTitle>
  
  <navMap>
    ${navMapItems}
  </navMap>
  
  <pageList id="pages" class="pagelist">
  
    <navLabel>
      <text>Pages</text>
    </navLabel>
    
    ${pageTargetItems}
           
  </pageList>
</ncx>
`;
    }

}
