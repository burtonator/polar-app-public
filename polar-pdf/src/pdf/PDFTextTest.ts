import {PDFText} from "./PDFText";
import {TextContent} from "pdfjs-dist";

xdescribe('PDFText', function() {

    xit("basic read", async function () {

        // file:///home/burton/Downloads/manual_dsc_envoy.pdf

        const dumpTextContent = (page: number, textContent: TextContent) => {
            // const rawText = textContent.items.map(current => current.str).join(' ');
            // console.log(`${page}: ${rawText}: `);
            // const fonts = textContent.items.map(current => current.fontName).join(', ');

            for(const item of textContent.items) {
                console.log(item.str);
                console.log('  dir: ', item.dir);
                console.log('  fontName: ', item.fontName);
                console.log('  transform: ', item.transform);
                console.log('  height: ', item.height);
            }


        };

        await PDFText.getText('/Users/burton/Downloads/p3181-adams.pdf', dumpTextContent);
    });

});
