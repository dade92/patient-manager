import React from 'react';
import {Box, Button, Chip, CircularProgress, Divider, ListItem, Typography} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {Invoice, InvoiceStatus} from '../../types/invoice';
import {formatAmount} from '../../utils/currencyUtils';
import {getInvoiceStatusColor} from '../../utils/invoiceUtils';
import {idFormatter} from '../../utils/idFormatter';

interface Props {
    invoice: Invoice;
    isLast: boolean;
    isUpdating: boolean;
    onMarkAsPaid: (invoiceId: string) => void;
}

export const InvoiceListItem: React.FC<Props> = ({invoice, isLast, isUpdating, onMarkAsPaid}) => (
    <React.Fragment key={invoice.id}>
        <ListItem alignItems="flex-start" disableGutters sx={{ height: 120 }}>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                {/* Left column: Icon, ID, and secondary info */}
                <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <PaymentIcon color="action"/>
                        <Typography variant="subtitle1" noWrap>
                            {idFormatter(invoice.id)}
                        </Typography>
                    </Box>
                    <Box sx={{mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5}}>
                        <Typography variant="body2" color="textSecondary" noWrap>
                            Operation: {idFormatter(invoice.operationId)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" noWrap>
                            Created at: {invoice.createdAt}
                        </Typography>
                        {invoice.status === InvoiceStatus.PAID && (
                            <Typography variant="caption" color="textSecondary" noWrap>
                                PAID at {invoice.updatedAt}
                            </Typography>
                        )}
                    </Box>
                </Box>
                {/* Right column: Price, Status, and Button */}
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, minWidth: 120, ml: 2}}>
                    <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                        <Typography variant="h6" color="primary" noWrap>
                            {formatAmount(invoice.amount.amount, invoice.amount.currency)}
                        </Typography>
                        <Chip
                            label={invoice.status}
                            size="small"
                            color={getInvoiceStatusColor(invoice.status)}
                            variant="outlined"
                        />
                    </Box>
                    {invoice.status === InvoiceStatus.PENDING && (
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={
                                isUpdating ? <CircularProgress size={16} color="inherit"/> :
                                    <CheckCircleIcon/>
                            }
                            onClick={() => onMarkAsPaid(invoice.id)}
                            sx={{mt: 0.5}}
                        >
                            {isUpdating ? 'Updating...' : 'Mark as Paid'}
                        </Button>
                    )}
                </Box>
            </Box>
        </ListItem>
        {!isLast && <Divider/>}
    </React.Fragment>
);
