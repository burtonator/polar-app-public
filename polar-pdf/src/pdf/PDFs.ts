import PDFJS from 'pdfjs-dist';
import { PDFWorkers } from './PDFWorkers';

export class PDFs {

    public static getPDFJS() {
        PDFJS.GlobalWorkerOptions.workerSrc = PDFWorkers.computeWorkerSrcPath();
        return PDFJS;
    }

}
