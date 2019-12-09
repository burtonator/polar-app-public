import {IText, Text} from './Text';
import {TextType} from './TextType';
import {isPresent} from "../Preconditions";
import {HTMLStr, PlainTextStr} from "../util/Strings";

export class Texts {

    public static create(body: string, type: TextType): Text {

        // TODO: if this is markdown, and we don't have the HTML version,
        // we need to add the HTML version by converting the markdown to HTML.

        const text = new Text();
        text[type] = body;
        return Object.freeze(text);

    }

    public static toHTML(text: IText | string | undefined): HTMLStr | undefined {

        if (text && this.isText(text)) {

            text = <Text> text;

            if (text.TEXT) {
                return text.TEXT;
            }

            if (text.MARKDOWN) {
                return text.MARKDOWN;
            }

            if (text.HTML) {
                return text.HTML;
            }

        }

        if (typeof text === 'string') {
            return text;
        }

        return undefined;

    }

    /**
     * This is somewhat confusing but take a Text object and convert it to a
     * plain text string with no HTML formatting.
     */
    public static toText(text: IText | string | undefined): PlainTextStr | undefined {

        if (! text) {
            return undefined;
        }

        if (this.isText(text)) {

            text = <Text> text;

            if (text.TEXT) {
                return text.TEXT;
            }

            if (text.MARKDOWN) {
                return text.MARKDOWN;
            }

            if (text.HTML) {

                if (typeof document === 'undefined') {
                    // we aren't running in the browser.
                    return text.HTML;
                }

                // TODO: this is very slow and can be improved at runtime.
                const div = document.createElement('div');
                div.innerHTML = text.HTML;
                return div.innerText;
            }

        }

        if (typeof text === 'string') {
            return text;
        }

        return undefined;

    }

    /**
     * Get the first field from the text object or the string value.
     */
    public static toString(text: IText | string | undefined): string | undefined {

        if (text && this.isText(text)) {

            text = <Text> text;

            if (isPresent(text.TEXT)) {
                return text.TEXT;
            }

            if (isPresent(text.MARKDOWN)) {
                return text.MARKDOWN;
            }

            if (isPresent(text.HTML)) {
                return text.HTML;
            }

        }

        if (typeof text === 'string') {
            return text;
        }

        return undefined;

    }

    public static isText(text: any | undefined): boolean {

        if (text && typeof text === 'object') {
            return isPresent(text.MARKDOWN) || isPresent(text.HTML) || isPresent(text.TEXT);
        }

        return false;

    }

}

