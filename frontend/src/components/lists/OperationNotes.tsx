import React from 'react';
import {Box, Button, Grid, List, Typography} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {OperationNote} from "../../types/operation";
import {NoteListItem} from './NoteListItem';

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
                    <NoteListItem
                        key={index}
                        note={note}
                        isLast={index === notes.length - 1}
                    />
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