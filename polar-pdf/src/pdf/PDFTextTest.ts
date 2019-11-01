import {PDFText} from "./PDFText";

xdescribe('PDFText', function() {

    xit("basic read", async function () {

        await PDFText.getText('/home/burton/projects/innodata-scratch/pypestream/manual/2018-mazda-6-112446.pdf',
                              ((page, textContent) => {
                                  const rawText = textContent.items.map(current => current.str).join(' ');
                                  console.log(`${page}: ${rawText}`);
                              }));
    });

});
