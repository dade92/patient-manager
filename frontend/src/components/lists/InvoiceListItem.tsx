import React from 'react';
import {Box, Divider, ListItem} from '@mui/material';
import {Invoice, InvoiceStatus} from '../../types/invoice';
import {InvoiceItemDetail} from "./InvoiceItemDetail";
import {InvoiceItemPayment} from "./InvoiceItemPayment";

interface Props {
    invoice: Invoice;
    isLast: boolean;
    isUpdatingOnPaid: boolean;
    isUpdatingOnCancel: boolean;
    onChangeInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
}

export const InvoiceListItem: React.FC<Props> = ({invoice, isLast, isUpdatingOnPaid, isUpdatingOnCancel, onChangeInvoiceStatus}) => (
    <React.Fragment key={invoice.id}>
        <ListItem alignItems="flex-start" disableGutters sx={{ height: 140 }}>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <InvoiceItemDetail invoice={invoice}/>
                <InvoiceItemPayment
                    invoice={invoice}
                    isUpdatingOnPaid={isUpdatingOnPaid}
                    isUpdatingOnCancel={isUpdatingOnCancel}
                    onChangeInvoiceStatus={onChangeInvoiceStatus}
                />
            </Box>
        </ListItem>
        {!isLast && <Divider/>}
    </React.Fragment>
);
