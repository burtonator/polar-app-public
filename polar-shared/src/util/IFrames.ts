export namespace IFrames {

    export async function waitForContentDocument(iframe: HTMLIFrameElement): Promise<Document> {

        return new Promise<Document>((resolve) => {

            let resolved: boolean = false;

            function doResolve() {

                if (resolved) {
                    return;
                }

                resolved = true;

                if (iframe.contentDocument) {
                    resolve(iframe.contentDocument);
                }

            }

            iframe.addEventListener('load', () => {
                doResolve();
            });

            doResolve();

        })

    }

}