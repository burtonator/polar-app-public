import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {MuiThemeProvider} from "@material-ui/core";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRoot = (props: IProps) => {

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

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline/>

            {props.children}
        </MuiThemeProvider>
    );

}
