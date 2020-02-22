
import {URLStr} from "polar-shared/src/util/Strings";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

/**
 * These load the raw pdf.js "pdfviewer" within a 'preview' where the document
 * hasn't been added to Polar yet.
 */
export class PreviewViewerURLs {

    /**
     * True if the URL is a preview URL.
     */
    public static isPreview(): boolean {
        const url = new URL(document.location!.href);
        return url.searchParams.get('preview') === 'true';
    }

    public static createPreviewURL(docURL: URLStr, docInfo: Partial<IDocInfo> = {}): URLStr {

        return `https://app.getpolarized.io/pdfviewer/web/index.html?file=` +
            encodeURIComponent(docURL) +
            `&preview=true` +
            '&docInfo=' + encodeURIComponent(JSON.stringify(docInfo));

    }

    /**
     * True if the URL is an auto-add URL and should automatically be added
     * to the users content repo.
     */
    public static isAutoAdd(): boolean {
        const url = new URL(document.location!.href);
        return url.searchParams.get('auto-add') === 'true';
    }

    public static isFromExtension(link: string = document.location!.href): boolean {
        const url = new URL(link);
        return url.searchParams.get('from') === 'true';
    }

    public static getDesktopAppState(link: string = document.location!.href): string {
        const url = new URL(link);
        return url.searchParams.get('desktop-app') || 'inactive';
    }

    public static createAutoAdd(link: string): string {
        const url = new URL(link);
        url.searchParams.set('auto-add', 'true');
        return url.toString();
    }

}
