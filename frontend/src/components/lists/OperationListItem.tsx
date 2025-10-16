import React from 'react';
import {
    Box,
    Chip,
    Divider,
    ListItemButton,
    ListItemText,
    Typography
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NoteIcon from '@mui/icons-material/Note';
import { Operation } from '../../types/operation';

interface Props {
    operation: Operation;
    isLast: boolean;
    onOperationClick: (operationId: string) => void;
}

export const OperationListItem: React.FC<Props> = ({
    operation,
    isLast,
    onOperationClick
}) =>
    (
        <React.Fragment key={operation.id}>
            <ListItemButton onClick={() => onOperationClick(operation.id)}>
                <ListItemText
                    primary={
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="subtitle1">
                                {operation.type} - {operation.executor}
                            </Typography>
                            <Box sx={{display: 'flex', gap: 1}}>
                                <Chip
                                    icon={<AttachFileIcon/>}
                                    label={operation.assets ? operation.assets.length : 0}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<NoteIcon/>}
                                    label={operation.additionalNotes ? operation.additionalNotes.length : 0}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    }
                    secondary={
                        <>
                            <Typography variant="body2" color="textSecondary">
                                {operation.description}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {operation.createdAt}
                            </Typography>
                        </>
                    }
                />
            </ListItemButton>
            {!isLast && <Divider/>}
        </React.Fragment>
    );
