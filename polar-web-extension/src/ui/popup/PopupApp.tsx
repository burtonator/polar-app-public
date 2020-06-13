import React from 'react';
import * as ReactDOM from 'react-dom';
import {MUIAppRoot} from "../mui/MUIAppRoot";
import LinearProgress from "@material-ui/core/LinearProgress";
import {FirestoreProvider} from "polar-bookshelf/apps/repository/js/FirestoreProvider";
import {UserInfoProvider} from "polar-bookshelf/web/js/apps/repository/auth_handler/UserInfoProvider";

export class PopupApp {

    public static start() {
        ReactDOM.render(
            <MUIAppRoot>
                <FirestoreProvider>
                    <UserInfoProvider>
                        <>
                            <p>
                                <h2>Loading... </h2>
                            </p>
                            <p>
                                <LinearProgress />
                            </p>
                        </>
                    </UserInfoProvider>
                </FirestoreProvider>
            </MUIAppRoot>
            ,
            document.body
        );

    }

}
