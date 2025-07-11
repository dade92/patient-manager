import React from 'react';
import {Divider, ListItem, ListItemText} from '@mui/material';
import {formatDateTime} from '../../utils/dateUtils';
import {OperationNote} from "../../types/operation";

interface Props {
    note: OperationNote;
    isLast: boolean;
}

export const NoteListItem: React.FC<Props> = ({ note, isLast }) => (
    <React.Fragment>
        <ListItem alignItems="flex-start">
            <ListItemText
                primary={note.content}
                secondary={formatDateTime(note.createdAt)}
            />
        </ListItem>
        {!isLast && <Divider component="li"/>}
    </React.Fragment>
);
