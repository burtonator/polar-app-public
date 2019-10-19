
export class ContentTypes {

    static contentTypeToExtension(contentType: string) {
        if(contentType === "text/html") {
            return "html";
        } else {
            return "dat";
        }
    }

}
