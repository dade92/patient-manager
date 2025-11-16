import React from 'react';
import {Divider, ListItem, ListItemText} from '@mui/material';
import {OperationNote} from "../../types/operation";

interface Props {
    note: OperationNote;
    isLast: boolean;
}

export const NoteListItem: React.FC<Props> = ({ note, isLast }) => (
    <React.Fragment>
        <ListItem alignItems="flex-start" data-testid="note-list-item">
            <ListItemText
                primary={note.content}
                secondary={note.createdAt}
                data-testid="note-text"
            />
        </ListItem>
        {!isLast && <Divider component="li" data-testid="note-divider"/>}
    </React.Fragment>
);
