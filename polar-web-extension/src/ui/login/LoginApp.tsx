import React from 'react';
import * as ReactDOM from 'react-dom';
import {MUIAppRoot} from "polar-bookshelf/web/js/mui/MUIAppRoot";
import {SignInScreen} from "polar-bookshelf/apps/repository/js/login/SignInScreen";

export class LoginApp {

    // https://stackoverflow.com/questions/44138761/using-firebase-for-auth-inside-chrome-extension-results-in-blank-popup
    //
    // This was kind of buried, and not highlighted in the example provided by Chrome/Firebase...but here's the answer:
    //
    // Only popup operations (signInWithPopup and linkWithPopup) are available
    // to Chrome extensions, as Chrome extensions cannot use HTTP redirects. You
    // should call these methods from a background script rather than a browser
    // action popup, as the authentication popup will cancel the browser action
    // popup.

    public static start() {
        ReactDOM.render(
            <MUIAppRoot>
                <SignInScreen/>
            </MUIAppRoot>
            ,
            document.getElementById('root')!
        );

    }

}
