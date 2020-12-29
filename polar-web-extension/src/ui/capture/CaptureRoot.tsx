import React from 'react';
import {PreviewContent} from './PreviewContent';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {useCaptureContentContext} from './CaptureApp';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import LinearProgress from '@material-ui/core/LinearProgress';
import {SaveToPolarHandler} from "../../services/SaveToPolarHandler";
import {SaveToPolarProgressListener} from './SaveToPolarProgressListener';
import {deepMemo} from 'polar-bookshelf/web/js/react/ReactUtils';
import SaveToPolarRequestWithEPUB = SaveToPolarHandler.SaveToPolarRequestWithEPUB;
import {ExtensionContentCapture} from "../../capture/ExtensionContentCapture";
import ICapturedEPUB = ExtensionContentCapture.ICapturedEPUB;
import {PolarLogoImage} from "polar-bookshelf/apps/repository/js/nav/PolarLogoImage";
import {PolarLogoText} from "polar-bookshelf/apps/repository/js/nav/PolarLogoText";

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

    const [saving, setSaving]= React.useState(false);

    const saveToPolar = React.useCallback((capture: ICapturedEPUB) => {

        setSaving(true);

        const message: SaveToPolarRequestWithEPUB = {
            type: 'save-to-polar',
            strategy: 'epub',
            value: capture
        }

        chrome.runtime.sendMessage(message);

    }, []);

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            <AppBar position="fixed" color="inherit">
                <Toolbar>

                    <div style={{
                             display: 'flex',
                             alignItems: 'center',
                             flexWrap: 'nowrap',
                             flexGrow: 1,
                         }}>

                        <PolarLogoImage width={50} height={50}/>
                        <PolarLogoText/>

                    </div>

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

            <div style={{
                     display: 'flex',
                     marginTop: '64px'
                }}>
                <PreviewContent/>
            </div>

            <SaveToPolarProgressListener/>

        </div>
    );
});
