import {ITextHighlight} from "./ITextHighlight";
import {HTMLStr} from "../util/Strings";
import {Texts} from "./Texts";

export class ITextHighlights {

    public static toHTML(textHighlight: ITextHighlight): HTMLStr | undefined {
        return Texts.toHTML(textHighlight.revisedText) || Texts.toHTML(textHighlight.text);
    }

    public static toText(textHighlight: ITextHighlight): HTMLStr | undefined {
        return Texts.toPlainText(textHighlight.revisedText) || Texts.toPlainText(textHighlight.text);
    }

}
