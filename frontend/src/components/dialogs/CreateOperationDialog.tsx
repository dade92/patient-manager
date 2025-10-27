import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {CreateOperationForm} from '../forms/CreateOperationForm';
import {Operation} from "../../types/operation";

interface Props {
    open: boolean;
    onClose: () => void;
    patientId: string;
    onOperationCreated: (operation: Operation) => void;
}

export const CreateOperationDialog: React.FC<Props> = ({
    open,
    onClose,
    patientId,
    onOperationCreated
}) => {
    const handleClose = () => {
        onClose();
    };
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Create New Operation
                <IconButton onClick={handleClose}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <CreateOperationForm
                patientId={patientId}
                onOperationCreated={(operation) => {
                    onOperationCreated(operation);
                    handleClose();
                }}
                onCancel={handleClose}/>
        </Dialog>
    );
};
