import React from 'react';
import {useCaptureContentContext} from "./CaptureApp";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {MUIBrowserLinkStyle} from "polar-bookshelf/web/js/mui/MUIBrowserLinkStyle";

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

            <MUIBrowserLinkStyle>

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

                {/*TODO: this needs to get teh latest version of the text and updaete the content.*/}

                <div dangerouslySetInnerHTML={{__html: captureContentContext.content}}></div>

                {/*<div contentEditable={true}*/}
                {/*     spellCheck={false}*/}
                {/*     style={{outline: 'none'}}*/}
                {/*     dangerouslySetInnerHTML={{__html: captureContentContext.content}}/>*/}

            </MUIBrowserLinkStyle>

        </div>
    );
}
