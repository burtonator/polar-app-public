import {ITextHighlight} from "./ITextHighlight";
import {HTMLStr} from "../util/Strings";
import {Texts} from "./Texts";
import {IText} from "./Text";

export class ITextHighlights {

    public static toHTML(textHighlight: ITextHighlight): HTMLStr | undefined {
        return Texts.toHTML(this.toIText(textHighlight));

    }

    public static toText(textHighlight: ITextHighlight): HTMLStr | undefined {
        return Texts.toText(this.toIText(textHighlight));
    }

    public static toIText(textHighlight: ITextHighlight): string | IText | undefined {
        return textHighlight.revisedText || textHighlight.text;
    }

}
