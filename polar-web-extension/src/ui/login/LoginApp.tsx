import React from 'react';
import * as ReactDOM from 'react-dom';
import {MUIAppRoot} from "polar-bookshelf/web/js/mui/MUIAppRoot";
import {LoginScreen} from "polar-bookshelf/apps/repository/js/login/LoginScreen";

export class LoginApp {

    public static start() {
        ReactDOM.render(
            <MUIAppRoot>
                <LoginScreen/>
            </MUIAppRoot>
            ,
            document.getElementById('root')!
        );

    }

}
