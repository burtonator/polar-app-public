import React from 'react';
import * as ReactDOM from 'react-dom';
import {ReadabilityCapture} from "../../ReadabilityCapture";
import {CaptureRoot} from "./CaptureRoot";
import {MUIAppRoot} from "../mui/MUIAppRoot";
import ICapturedContent = ReadabilityCapture.ICapturedContent;

const CaptureContentContext = React.createContext<ICapturedContent>(null!);

export function useCaptureContentContext() {
    return React.useContext(CaptureContentContext);
}

export class CaptureApp {

    public static start(content: ICapturedContent) {

        ReactDOM.render(
            <MUIAppRoot>
                <CaptureContentContext.Provider value={content}>
                    <CaptureRoot/>
                </CaptureContentContext.Provider>
            </MUIAppRoot>
            ,
            document.body
        );

    }

}
