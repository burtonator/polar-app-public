import React from 'react';
import {PreviewContent} from './PreviewContent';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {useCaptureContentContext} from './CaptureApp';
import {ReadabilityCapture} from "../../ReadabilityCapture";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import LinearProgress from '@material-ui/core/LinearProgress';
import {SaveToPolarHandler} from "../../services/SaveToPolarHandler";
import {NavLogo} from "polar-bookshelf/apps/repository/js/nav/NavLogo";
import ICapturedContent = ReadabilityCapture.ICapturedEPUB;
import SaveToPolarRequestWithEPUB = SaveToPolarHandler.SaveToPolarRequestWithEPUB;
import { SaveToPolarProgressListener } from './SaveToPolarProgressListener';
import { deepMemo } from 'polar-bookshelf/web/js/react/ReactUtils';

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

export const CaptureRoot = deepMemo(() => {

    const captureContentContext = useCaptureContentContext();

    const classes = useStyles();

    const [saving, setSaving]= React.useState(false);

    // FIXME: move this to a script to send varrious messages to trigger the capture
    function saveToPolar(capture: ICapturedContent) {

        setSaving(true);

        const message: SaveToPolarRequestWithEPUB = {
            type: 'save-to-polar',
            strategy: 'epub',
            value: capture
        }

        chrome.runtime.sendMessage(message);

    }
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            <AppBar position="static" color="inherit">
                <Toolbar>

                    <NavLogo/>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => saveToPolar(captureContentContext)}
                        startIcon={<CloudUploadIcon/>}>

                        Save to Polar

                    </Button>

                </Toolbar>
            </AppBar>

            {saving && <LinearProgress />}

            <div style={{display: 'flex'}}>
                <PreviewContent/>
            </div>

            <SaveToPolarProgressListener/>

        </div>
    );
});
