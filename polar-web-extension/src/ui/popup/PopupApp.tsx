import React from 'react';
import * as ReactDOM from 'react-dom';
import {MUIAppRoot} from "../mui/MUIAppRoot";
import LinearProgress from "@material-ui/core/LinearProgress";

export class PopupApp {

    public static start() {
        ReactDOM.render(
            <MUIAppRoot>
                <p>
                    <h2>Loading... </h2>
                </p>
                <p>
                    <LinearProgress />
                </p>
            </MUIAppRoot>
            ,
            document.body
        );

    }

}
