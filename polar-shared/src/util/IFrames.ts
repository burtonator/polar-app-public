export namespace IFrames {

    export async function waitForLoad(iframe: HTMLIFrameElement): Promise<Document> {

        return new Promise<Document>((resolve) => {

            let resolved: boolean = false;

            function doResolve() {

                if (resolved) {
                    return;
                }

                resolved = true;

                if (iframe.contentDocument && iframe.contentWindow) {
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