import React from 'react';
import * as ReactDOM from 'react-dom';
import {ReadabilityCapture} from "../ReadabilityCapture";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import ICapturedContent = ReadabilityCapture.ICapturedContent;
import {CaptureRoot} from "./CaptureRoot";

const CaptureContentContext = React.createContext<ICapturedContent>(null!);

export function useCaptureContentContext() {
    return React.useContext(CaptureContentContext);
}

export class CaptureApp {

    public static start(content: ICapturedContent) {

        const muiTheme = createMuiTheme({
            typography: {
                htmlFontSize: 12,
                fontSize: 12
            },
            palette: {
                type: 'dark',
                primary: {
                    // main: 'rgb(135, 141, 246)'
                    main: 'rgb(103, 84, 214)'
                }
            }
        });

        ReactDOM.render(
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline/>

                <CaptureContentContext.Provider value={content}>
                    <CaptureRoot/>
                </CaptureContentContext.Provider>
            </MuiThemeProvider>
            ,
            document.body
        );

    }

}
