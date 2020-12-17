import {ReadabilityCapture} from "./ReadabilityCapture";
import {Selections} from "polar-bookshelf/web/js/highlights/text/selection/Selections";
import {SelectionCapture} from "./SelectionCapture";
import {PageMetadata} from "page-metadata-parser";
import { HTMLStr, PlainTextStr } from "polar-shared/src/util/Strings";

export namespace ExtensionContentCapture {

    import hasActiveTextSelection = Selections.hasActiveTextSelection;

    // TODO ... Rong... pass the author

    export interface ICapturedEPUB extends PageMetadata {
        readonly content: HTMLStr;
        readonly text: PlainTextStr;
        readonly excerpt: PlainTextStr;
    }

    export function capture(): ICapturedEPUB {

        const selection = window.getSelection();
        if (selection !== null && hasActiveTextSelection(selection)) {
            return SelectionCapture.capture();
        } else {
            return ReadabilityCapture.capture();
        }
    }

}