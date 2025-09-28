import React, {useState} from 'react';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Operation} from "../../types/operation";
import {RestClient} from '../../utils/restClient';

interface Props {
    open: boolean;
    onClose: () => void;
    operationId: string;
    onNoteAdded: (updatedOperation: Operation) => void;
}

export const AddNoteDialog: React.FC<Props> = ({
    open,
    onClose,
    operationId,
    onNoteAdded
}) => {
    const [noteContent, setNoteContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!noteContent.trim()) {
            setError('Note content cannot be empty');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const updatedOperation = await RestClient.post<Operation>(
                `/api/operation/${operationId}/notes`,
                {content: noteContent}
            );
            onNoteAdded(updatedOperation);
            setNoteContent('');
            onClose();
        } catch (err: any) {
            setError('An error occurred while adding the note');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setNoteContent('');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                Add Note
                <IconButton onClick={handleCancel}>
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        Add Note
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
