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
}) => (
    <React.Fragment key={operation.id}>
        <ListItemButton onClick={() => onOperationClick(operation.id)} data-testid="operation-list-item-button">
            <ListItemText
                primary={
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }} data-testid="operation-primary">
                        <Typography variant="subtitle1" data-testid="operation-title">
                            {operation.type} - {operation.executor}
                        </Typography>
                        <Box sx={{display: 'flex', gap: 1}}>
                            <Chip
                                icon={<AttachFileIcon/>}
                                label={operation.assets ? operation.assets.length : 0}
                                size="small"
                                color="primary"
                                variant="outlined"
                                data-testid="operation-assets-chip"
                            />
                            <Chip
                                icon={<NoteIcon/>}
                                label={operation.additionalNotes ? operation.additionalNotes.length : 0}
                                size="small"
                                color="secondary"
                                variant="outlined"
                                data-testid="operation-notes-chip"
                            />
                        </Box>
                    </Box>
                }
                secondary={
                    <>
                        <Typography variant="body2" color="textSecondary" data-testid="operation-description">
                            {operation.description}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" data-testid="operation-created-at">
                            {operation.createdAt}
                        </Typography>
                    </>
                }
            />
        </ListItemButton>
        {!isLast && <Divider data-testid="operation-divider"/>}
    </React.Fragment>
);
