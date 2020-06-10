import React from 'react';
import Paper from "@material-ui/core/Paper";
import { PreviewContent } from './PreviewContent';

export const CaptureRoot = () => (
    <Paper style={{
               margin: 'auto',
               maxWidth: '800px',
               overflow: 'hidden',
               padding: '5px'
           }}>
        <PreviewContent/>
    </Paper>
);
