import React from 'react';
import {
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { formatDateTime } from '../utils/dateUtils';

interface OperationNote {
    content: string;
    createdAt: string;
}

interface OperationNotesProps {
    notes: OperationNote[];
}

export const OperationNotes: React.FC<OperationNotesProps> = ({ notes }) => {
    if (!notes || notes.length === 0) {
        return null;
    }

    return (
        <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Notes
            </Typography>
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
