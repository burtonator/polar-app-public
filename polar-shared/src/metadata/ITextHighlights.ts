import {ITextHighlight} from "./ITextHighlight";
import {Text} from "./Text";
import {HTMLStr} from "../util/Strings";
import {isPresent} from "../Preconditions";

export class ITextHighlights {

    public static toHTML(textHighlight: ITextHighlight): HTMLStr {

        let html: string = "";

        if (typeof textHighlight.text === 'string') {
            html = `<p>${textHighlight.text}</p>`;
        }

        // TODO: prefer to use revisedText so that the user can edit the text
        // that we selected from the document without reverting to the original

        if (isPresent(textHighlight.text) && typeof textHighlight.text === 'object') {

            // TODO: move this to an isInstanceOf in Texts
            if ('TEXT' in <any> (textHighlight.text) || 'HTML' in <any> (textHighlight.text)) {

                const text = <Text> textHighlight.text;

                if (text.TEXT) {
                    html = `${text.TEXT}`;
                }

                if (text.HTML) {
                    html = text.HTML;
                }

            }

        }

        return html;

    }

}
