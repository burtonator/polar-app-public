export namespace ChromeStoreURLs {

    export function create() {

        if (document.location.href!.startsWith('https://beta.getpolarized.io')) {
            return 'https://chrome.google.com/webstore/detail/save-to-polar-beta/mklidoahhflhlpcpigokeckcipaibopd?hl=en';
        }

        return "https://chrome.google.com/webstore/detail/polar-pdf-web-and-documen/jkfdkjomocoaljglgddnmhcbolldcafd";

    }

}
