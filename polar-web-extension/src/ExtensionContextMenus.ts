import {handleStartCapture} from "./content";

export namespace ExtensionContextMenus {

    const opts = {
        title: "Save to Polar"
    };

    chrome.contextMenus.create(opts, handleStartCapture);

}
