import PDFJS from 'pdfjs-dist';

export class PDFs {

    /**
     *
     */
    public static getPDFJS() {
        PDFJS.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js';
        return PDFJS;
    }

}
