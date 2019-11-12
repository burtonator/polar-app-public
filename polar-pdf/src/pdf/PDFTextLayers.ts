export class PDFTextLayers {

    public static enableModernTextLayers(enabled: boolean = true) {

        if (window.localStorage) {

            const val = {
                "showPreviousViewOnLoad": true,
                "defaultZoomValue": "",
                "sidebarViewOnLoad": 0,
                "cursorToolOnLoad": 0,
                "enableWebGL": false,
                "eventBusDispatchToDOM": false,
                "pdfBugEnabled": false,
                "disableRange": false,
                "disableStream": false,
                "disableAutoFetch": false,
                "disableFontFace": false,
                "textLayerMode": 2,
                "useOnlyCssZoom": false,
                "externalLinkTarget": 0,
                "renderer": "canvas",
                "renderInteractiveForms": false,
                "enablePrintAutoRotate": false,
                "disablePageMode": false,
                "disablePageLabels": false,
                "scrollModeOnLoad": 0,
                "spreadModeOnLoad": 0
            };

            const json = JSON.stringify(val);

            window.localStorage.setItem('pdfjs.preferences', json);

        }

    }

    public static disableModernTextLayers() {
        window.localStorage.removeItem('pdfjs.preferences');
    }

}
