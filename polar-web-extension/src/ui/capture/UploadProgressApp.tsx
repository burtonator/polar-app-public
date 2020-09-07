import * as ReactDOM from "react-dom";
import React from "react";
import {MUIAppRoot} from "polar-bookshelf/web/js/mui/MUIAppRoot";
import {SaveToPolarProgressListener} from "./SaveToPolarProgressListener";

export namespace UploadProgressApp {

    export function start(container: Element = document.body) {

        ReactDOM.render(
            <MUIAppRoot>
                <SaveToPolarProgressListener progress={{type: 'indeterminate'}}/>
            </MUIAppRoot>
            ,
            container
        );

    }

}
