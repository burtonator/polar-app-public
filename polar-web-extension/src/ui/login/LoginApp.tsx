import React from 'react';
import * as ReactDOM from 'react-dom';
import {MUIAppRoot} from "../mui/MUIAppRoot";
import {FirestoreProvider} from "polar-bookshelf/apps/repository/js/FirestoreProvider";
import {UserInfoProvider} from "polar-bookshelf/web/js/apps/repository/auth_handler/UserInfoProvider";

export class LoginApp {

    public static start() {
        ReactDOM.render(
            <MUIAppRoot>
                <FirestoreProvider>
                    <UserInfoProvider>
                        {/*<LoginScreen/>*/}
                    </UserInfoProvider>
                </FirestoreProvider>
            </MUIAppRoot>
            ,
            document.body
        );

    }

}
