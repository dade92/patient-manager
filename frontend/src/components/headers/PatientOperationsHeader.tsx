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
        >
            <Typography variant="h6">
                Operations History
            </Typography>
            <IconButton size="small">
                {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </IconButton>
        </Box>
    );
