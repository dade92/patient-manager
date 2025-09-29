import React from 'react';
import {Box, Button, Chip, CircularProgress, Divider, ListItem, Typography} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {Invoice, InvoiceStatus} from '../../types/invoice';
import {formatAmount} from '../../utils/currencyUtils';
import {getInvoiceStatusColor} from '../../utils/invoiceUtils';
import {idFormatter} from '../../utils/idFormatter';
import {InvoiceItemDetail} from "./InvoiceItemDetail";
import {InvoiceItemPayment} from "./InvoiceItemPayment";

interface Props {
    invoice: Invoice;
    isLast: boolean;
    isUpdatingOnPaid: boolean;
    onMarkAsPaid: (invoiceId: string) => void;
    onCancel: (invoiceId: string) => void;
}

export const InvoiceListItem: React.FC<Props> = ({invoice, isLast, isUpdatingOnPaid, onMarkAsPaid, onCancel}) => (
    <React.Fragment key={invoice.id}>
        <ListItem alignItems="flex-start" disableGutters sx={{ height: 140 }}>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <InvoiceItemDetail invoice={invoice}/>
                <InvoiceItemPayment invoice={invoice} onMarkAsPaid={onMarkAsPaid} isUpdatingOnPaid={isUpdatingOnPaid} onCancel={onCancel}/>
            </Box>
        </ListItem>
        {!isLast && <Divider/>}
    </React.Fragment>
);
