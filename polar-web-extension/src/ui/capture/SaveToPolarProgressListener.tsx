import React from 'react';
import {deepMemo} from "polar-bookshelf/web/js/react/ReactUtils";
import {WriteFileProgress} from "polar-bookshelf/web/js/datastore/Datastore";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "polar-bookshelf/web/js/hooks/ReactLifecycleHooks";
import {TypedMessage} from 'polar-bookshelf/web/js/util/TypedMessage';
import {UploadProgressDialog} from "polar-bookshelf/web/js/ui/dialogs/UploadProgressDialog";
import {Percentage} from "polar-shared/src/util/ProgressTracker";

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

export interface IndeterminateProgress {
    readonly type: 'indeterminate';
}

export interface DeterminateProgress {
    readonly type: 'determinate';
    readonly value: Percentage;
}

export type Progress = IndeterminateProgress | DeterminateProgress;

interface IProps {

    /**
     * The initial progress
     */
    readonly progress?: Progress;

}

/**
 * Component called when a document is being uploaded.
 */
export const SaveToPolarProgressListener = deepMemo((props: IProps) => {

    const [progress, setProgress] = React.useState<Progress | undefined>(props.progress)

    useChromeMessageListener<WriteFileProgress>('progress', newProgress => {
        console.log(`progress: type: ${newProgress.type} value: ${newProgress.value}`, newProgress);
        setProgress(newProgress);
    })

    if (! progress) {
        return null;
    }

    if (progress.type === 'indeterminate') {
        return <UploadProgressDialog value='indeterminate'/>
    }

    if (progress.type === 'determinate') {
        return <UploadProgressDialog value={progress.value}/>
    }

    return null;

});
