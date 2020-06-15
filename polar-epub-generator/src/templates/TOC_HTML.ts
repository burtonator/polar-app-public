
export namespace TOC_HTML {

    export interface TOC {
        readonly title: string;

        readonly links: ReadonlyArray<ILink>;
    }

    export interface ILink {
        readonly href: string;
        readonly title: string;
    }

    interface GenerateOpts {
        readonly title: string;
        readonly links: ReadonlyArray<ILink>;
    }

    function generateLinks(links: ReadonlyArray<ILink>): string {

        function toHTML(link: ILink): string {
            return `<li><a href="${link.href}">${link.title}</a></li>`;
        }

        return links.map(toHTML).join("\n");

    }

    export function generate(opts: GenerateOpts): string {

        const links = generateLinks(opts.links);

        return `<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN' 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
<title>Table of Contents</title>
</head>
<body>
<!-- <nav role="doc-toc" epub:type="toc" id="toc"> -->
<h2>${opts.title}</h2>
<ol>
${links}
</ol>
<!-- </nav> -->
</body>
</html>
`;

    }

}
