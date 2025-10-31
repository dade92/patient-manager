import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<Props> = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    isLoading = false
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {title}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    disabled={isLoading}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {cancelButtonText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={isLoading}
                >
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
