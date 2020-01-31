import {PDFText} from "./PDFText";
import {TextContent} from "pdfjs-dist";

xdescribe('PDFText', function() {

    xit("basic read", async function () {

        // file:///home/burton/Downloads/manual_dsc_envoy.pdf

        const dumpTextContent = (page: number, textContent: TextContent) => {
            const rawText = textContent.items.map(current => current.str).join(' ');
            // const fonts = textContent.items.map(current => current.fontName).join(', ');

            console.log(`${page}: ${rawText}: `);

        };

        await PDFText.getText('/home/burton/Downloads/manual_dsc_envoy.pdf', dumpTextContent);
    });

});
