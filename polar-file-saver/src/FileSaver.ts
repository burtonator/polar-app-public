import { saveAs } from 'file-saver';

/**
 * FileSaver interface for saving data to disk.
 *
 * https://github.com/eligrey/FileSaver.js
 */
export class FileSaver {

    /**
     * Trigger a file download using the specified filename and blob.
     * @param blob
     * @param filename
     */
    public static saveAs(blob: Blob, filename: string) {
        saveAs(blob, filename);
    }

}
