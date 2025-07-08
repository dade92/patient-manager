import React from 'react';
import {
    Badge,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Props {
    expanded: boolean;
    hasPendingInvoices: boolean;
    pendingInvoicesCount: number;
    onToggleExpanded: () => void;
}

export const PatientInvoicesHeader: React.FC<Props> = ({
    expanded,
    hasPendingInvoices,
    pendingInvoicesCount,
    onToggleExpanded
}) =>
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
            onClick={onToggleExpanded}
        >
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                {hasPendingInvoices ? (
                    <Badge
                        badgeContent={pendingInvoicesCount}
                        color="warning"
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: '#ff9800',
                                color: 'white',
                                fontSize: '0.65rem',
                                minWidth: '16px',
                                height: '16px'
                            }
                        }}
                    >
                        <Typography variant="h6">
                            Invoices
                        </Typography>
                    </Badge>
                ) : (
                    <Typography variant="h6">
                        Invoices
                    </Typography>
                )}
            </Box>
            <IconButton size="small">
                {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </IconButton>
        </Box>
    );
