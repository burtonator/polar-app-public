import {saveAs} from 'file-saver';

/**
 * FileSaver interface for saving data to disk.
 *
 * https://github.com/eligrey/FileSaver.js
 */
export class FileSavers {

    /**
     * Trigger a file download using the specified filename and blob.
     */
    public static saveAs(blob: Blob | string | File, filename: string) {
        saveAs(blob, filename);
    }

}
