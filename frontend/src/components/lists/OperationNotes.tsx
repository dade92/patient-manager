import React from 'react';
import {Box, Button, Divider, Grid, List, ListItem, ListItemText, Typography} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {formatDateTime} from '../../utils/dateUtils';
import {OperationNote} from "../../types/operation";

interface AddNoteButtonProps {
    onClick: () => void;
}

interface Props {
    notes: OperationNote[];
    onAddNote: () => void;
}

export const OperationNotes: React.FC<Props> = ({notes, onAddNote}) => {
    if (notes.length === 0) {
        return <Grid item xs={12}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                <Typography variant="subtitle1" color="textSecondary">
                    Notes
                </Typography>
                <AddNoteButton onClick={onAddNote}/>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{fontStyle: 'italic'}}>
                No notes yet
            </Typography>
        </Grid>;
    }

    return (
        <Grid item xs={12}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                <Typography variant="subtitle1" color="textSecondary">
                    Notes
                </Typography>
                <AddNoteButton onClick={onAddNote}/>
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
                        {index < notes.length - 1 && <Divider component="li"/>}
                    </React.Fragment>
                ))}
            </List>
        </Grid>
    );
};

const AddNoteButton: React.FC<AddNoteButtonProps> = ({onClick}) => (
    <Button
        variant="outlined"
        size="small"
        startIcon={<NoteAddIcon/>}
        onClick={onClick}
    >
        Add Note
    </Button>
);