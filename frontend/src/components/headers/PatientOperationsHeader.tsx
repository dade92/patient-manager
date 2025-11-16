import React from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Props {
    expanded: boolean;
    onToggle: () => void;
}

export const PatientOperationsHeader: React.FC<Props> = ({expanded, onToggle}) =>
    (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                },
                borderRadius: 1,
                p: 1,
                mx: -1
            }}
            onClick={onToggle}
            data-testid="patient-operations-header"
        >
            <Typography variant="h6" data-testid="operations-title">
                Operations History
            </Typography>
            <IconButton size="small" data-testid="toggle-button">
                {expanded ? <ExpandLessIcon data-testid="collapse-icon"/> : <ExpandMoreIcon data-testid="expand-icon"/>}
            </IconButton>
        </Box>
    );
