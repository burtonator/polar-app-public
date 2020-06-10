import React from 'react';
import {useCaptureContentContext} from "./CaptureApp";

export const PreviewContent = () => {
    const captureContentContext = useCaptureContentContext();

    return (
        <div style={{padding: '5px'}}>
            <h1>{captureContentContext.title}</h1>

            {captureContentContext.image && (
                <div style={{display: 'flex'}}>

                    <img style={{
                             maxHeight: '200px',
                             margin: 'auto'
                         }}
                         src={captureContentContext.image}/>

                </div>
            )}

            <div dangerouslySetInnerHTML={{__html: captureContentContext.content}}></div>
        </div>
    );
}
