import {Box, Button, Chip, CircularProgress, Typography} from "@mui/material";
import {Invoice, InvoiceStatus} from "../../types/invoice";
import React from "react";
import {formatAmount} from "../../utils/currencyUtils";
import { getInvoiceStatusColor } from "../../utils/invoiceUtils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
    invoice: Invoice;
    isUpdating: boolean;
    onMarkAsPaid: (invoiceId: string) => void;
}

export const InvoiceItemPayment: React.FC<Props> = ({invoice, onMarkAsPaid, isUpdating}) =>
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