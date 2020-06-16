import React from 'react';
import Paper from "@material-ui/core/Paper";
import {PreviewContent} from './PreviewContent';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Container from "@material-ui/core/Container";
import {useCaptureContentContext} from './CaptureApp';
import {ReadabilityCapture} from "../../ReadabilityCapture";
import ICapturedContent = ReadabilityCapture.ICapturedContent;
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

function saveToPolar(capture: ICapturedContent) {

    const message = {
        type: 'save-to-polar',
        value: capture
    }

    chrome.runtime.sendMessage(message);

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export const CaptureRoot = () => {

    const captureContentContext = useCaptureContentContext();

    const classes = useStyles();

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            <AppBar position="static" color="inherit">
                <Toolbar>

                    <Typography variant="h6" className={classes.title}>
                        Polar
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => saveToPolar(captureContentContext)}
                        startIcon={<CloudUploadIcon/>}>

                        Save to Polar

                    </Button>

                </Toolbar>
            </AppBar>

            <div style={{display: 'flex'}}>
                <PreviewContent/>
            </div>

        </div>
    );
}
