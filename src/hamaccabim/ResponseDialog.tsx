// ResponseDialog.tsx
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

interface ResponseDialogProps {
    open: boolean;
    onClose: () => void;
}

const ResponseDialog: React.FC<ResponseDialogProps> = ({ open, onClose }) => {
    return (
        <Dialog
            onClose={onClose}
            aria-labelledby="response-dialog-title"
            open={open}
        >
            <DialogTitle id="response-dialog-title">
                Modal title
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom>
                    thank you
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResponseDialog;
