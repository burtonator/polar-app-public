import React from 'react';
import {deepMemo} from "polar-bookshelf/web/js/react/ReactUtils";
import {WriteFileProgress} from "polar-bookshelf/web/js/datastore/Datastore";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "polar-bookshelf/web/js/hooks/ReactLifecycleHooks";
import { TypedMessage } from 'polar-bookshelf/web/js/util/TypedMessage';
import {DeterminateActivityProgress} from "polar-bookshelf/web/js/ui/progress_bar/DeterminateActivityProgress";

export function useChromeMessageListener<T>(type: string, handler: (value: T) => void) {

    const onMessageListener = React.useCallback((message) => {

        const typedMessage = message as TypedMessage<T>;

        if (type === typedMessage.type) {
            const value = typedMessage.value;
            handler(value);
        }

    }, []);

    useComponentDidMount(() => {
        chrome.runtime.onMessage.addListener(onMessageListener);
    })

    useComponentWillUnmount(() => {
        chrome.runtime.onMessage.removeListener(onMessageListener);
    })

}

/**
 * Component called when a document is being uploaded.
 */
export const SaveToPolarProgressListener = deepMemo(() => {

    const [progress, setProgress] = React.useState<WriteFileProgress | undefined>()

    useChromeMessageListener<WriteFileProgress>('progress', newProgress => {
        console.log("progress", newProgress);
        setProgress(progress);
    })

    if (! progress) {
        return null;
    }

    if (progress.type === 'determinate') {
        return <DeterminateActivityProgress value={progress.value}/>
    }

    // if (progress.)
    //

    return null;

});
