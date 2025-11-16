import React, {useState} from 'react';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useAddNote} from '../../hooks/useAddNote';
import {Operation} from '../../types/operation';

interface Props {
    open: boolean;
    onClose: () => void;
    operationId: string;
    onSuccess?: (updatedOperation: Operation) => void;
}

export const AddNoteDialog: React.FC<Props> = ({open, onClose, operationId, onSuccess}) => {
    const [noteContent, setNoteContent] = useState('');
    const {addNote, error, isSubmitting} = useAddNote(operationId!);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedOperation = await addNote(noteContent);
        if (updatedOperation) {
            setNoteContent('');
            if (onSuccess) {
                onSuccess(updatedOperation);
            }
            onClose();
        }
    };

    const handleCancel = () => {
        setNoteContent('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Add Note
                <IconButton onClick={handleCancel} disabled={isSubmitting}>
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        fullWidth
                        label="Note Content"
                        multiline
                        rows={4}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        margin="dense"
                        disabled={isSubmitting}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        Add Note
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
