import React from 'react';
import {useCaptureContentContext} from "./CaptureApp";
import {MUIBrowserLinks} from "polar-bookshelf/web/js/mui/MUIBrowserLinks";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            margin: 'auto',
            maxWidth: '850px',
            flexGrow: 1,
            padding: '5px',
            "& img": {
                maxWidth: '850px',
                height: 'auto'
            }
        },
    }),
);

export const PreviewContent = () => {

    const classes = useStyles();
    const captureContentContext = useCaptureContentContext();

    return (

        <div className={classes.root}>

            <MUIBrowserLinks>

                <h1>{captureContentContext.title}</h1>

                {captureContentContext.image && (
                    <div style={{display: 'flex'}}>

                        <img style={{
                                 margin: 'auto',
                             }}
                             alt="Preview image"
                             src={captureContentContext.image}/>

                    </div>
                )}

                <div dangerouslySetInnerHTML={{__html: captureContentContext.content}}></div>

            </MUIBrowserLinks>

        </div>
    );
}
