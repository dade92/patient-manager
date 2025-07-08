import React from 'react';
import {
    Box,
    Button,
    Chip,
    Divider,
    ListItem,
    ListItemText,
    Typography,
    CircularProgress
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Invoice, InvoiceStatus } from '../types/invoice';
import { formatAmount } from '../utils/currencyUtils';
import { getInvoiceStatusColor } from '../utils/invoiceUtils';

interface InvoiceListItemProps {
    invoice: Invoice;
    isLast: boolean;
    isUpdating: boolean;
    onMarkAsPaid: (invoiceId: string) => void;
}

export const InvoiceListItem: React.FC<InvoiceListItemProps> = ({
    invoice,
    isLast,
    isUpdating,
    onMarkAsPaid
}) =>
    (
        <React.Fragment key={invoice.id}>
            <ListItem>
                <ListItemText
                    primary={
                        <Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <PaymentIcon color="action"/>
                                    <Typography variant="subtitle1">
                                        {invoice.id}
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                    <Typography variant="h6" color="primary">
                                        {formatAmount(invoice.amount.amount, invoice.amount.currency)}
                                    </Typography>
                                    <Chip
                                        label={invoice.status}
                                        size="small"
                                        color={getInvoiceStatusColor(invoice.status)}
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                            {invoice.status === InvoiceStatus.PENDING && (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    mt: 1
                                }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="success"
                                        startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon/>}
                                        onClick={() => onMarkAsPaid(invoice.id)}
                                    >
                                        {isUpdating ? 'Updating...' : 'Mark as Paid'}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    }
                    secondary={
                        <Box sx={{mt: 1}}>
                            <Typography variant="body2" color="textSecondary">
                                Operation ID: {invoice.operationId}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {invoice.createdAt}
                            </Typography>
                        </Box>
                    }
                />
            </ListItem>
            {!isLast && <Divider/>}
        </React.Fragment>
    );
