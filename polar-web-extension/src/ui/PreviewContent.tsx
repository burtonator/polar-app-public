import React from 'react';
import {useCaptureContentContext} from "./CaptureApp";

export const PreviewContent = () => {
    const captureContentContext = useCaptureContentContext();

    return (
        <div>
            <h1>{captureContentContext.title}</h1>

            {captureContentContext.image && (
                <div>
                    <img src={captureContentContext.image}/>
                </div>
            )}

            <div dangerouslySetInnerHTML={{__html: captureContentContext.content}}></div>
        </div>
    );
}
