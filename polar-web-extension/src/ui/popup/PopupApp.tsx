import React from 'react';
import * as ReactDOM from 'react-dom';
import {FirestoreProvider} from "polar-bookshelf/apps/repository/js/FirestoreProvider";
import {UserInfoProvider} from "polar-bookshelf/web/js/apps/repository/auth_handler/UserInfoProvider";
import {MUIAppRoot} from 'polar-bookshelf/web/js/mui/MUIAppRoot';
import CircularProgress from '@material-ui/core/CircularProgress';

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
                                <CircularProgress />
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
