import React from 'react';
import {
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    Button
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { formatDateTime } from '../utils/dateUtils';

interface OperationNote {
    content: string;
    createdAt: string;
}

interface OperationNotesProps {
    notes: OperationNote[];
    onAddNote: () => void;
}

export const OperationNotes: React.FC<OperationNotesProps> = ({ notes, onAddNote }) => {
    if (!notes || notes.length === 0) {
        return onAddNote ? (
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Notes
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<NoteAddIcon />}
                        onClick={onAddNote}
                    >
                        Add Note
                    </Button>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    No notes yet
                </Typography>
            </Grid>
        ) : null;
    }

    return (
        <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" color="textSecondary">
                    Notes
                </Typography>
                {onAddNote && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<NoteAddIcon />}
                        onClick={onAddNote}
                    >
                        Add Note
                    </Button>
                )}
            </Box>
            <List>
                {notes.map((note, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={note.content}
                                secondary={formatDateTime(note.createdAt)}
                            />
                        </ListItem>
                        {index < notes.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
        </Grid>
    );
};
