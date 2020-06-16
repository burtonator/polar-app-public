import React from 'react';
import {useCaptureContentContext} from "./CaptureApp";

export const PreviewContent = () => {
    const captureContentContext = useCaptureContentContext();

    return (

        <div style={{
                 margin: 'auto',
                 maxWidth: '850px',
                 flexGrow: 1,
                 padding: '5px'
             }}>

            <h1>{captureContentContext.title}</h1>

            {captureContentContext.image && (
                <div style={{display: 'flex'}}>

                    <img style={{
                             maxHeight: '200px',
                             margin: 'auto'
                         }}
                         alt="Preview image"
                         src={captureContentContext.image}/>

                </div>
            )}

            <div dangerouslySetInnerHTML={{__html: captureContentContext.content}}></div>

        </div>
    );
}
