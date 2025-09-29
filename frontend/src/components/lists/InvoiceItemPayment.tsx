import {Box, Button, Chip, CircularProgress, Typography} from "@mui/material";
import {Invoice, InvoiceStatus} from "../../types/invoice";
import React from "react";
import {formatAmount} from "../../utils/currencyUtils";
import {getInvoiceStatusColor} from "../../utils/invoiceUtils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
    invoice: Invoice;
    isUpdatingOnPaid: boolean;
    isUpdatingOnCancel: boolean;
    onMarkAsPaid: (invoiceId: string) => void;
    onCancel: (invoiceId: string) => void;
}

export const InvoiceItemPayment: React.FC<Props> = ({invoice, onMarkAsPaid, isUpdatingOnPaid, onCancel, isUpdatingOnCancel}) =>
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, minWidth: 120, ml: 2}}>
        <Typography sx={{ fontWeight: 400 }} noWrap>
            {formatAmount(invoice.amount.amount, invoice.amount.currency)}
        </Typography>
        <Chip
            label={invoice.status}
            size="small"
            color={getInvoiceStatusColor(invoice.status)}
            variant="outlined"
        />
        {invoice.status === InvoiceStatus.PENDING && (
            <Button
                variant="contained"
                size="small"
                color="success"
                startIcon={
                    isUpdatingOnPaid ? <CircularProgress size={14} color="inherit"/> :
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                }
                onClick={() => onMarkAsPaid(invoice.id)}
                sx={{ mt: 0.5, minWidth: 80, px: 1, py: 0.5, fontSize: '0.75rem', lineHeight: 1.2 }}
            >
                {isUpdatingOnPaid ? 'Updating...' : 'Mark as Paid'}
            </Button>
        )}
        {invoice.status === InvoiceStatus.PENDING && (
            <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={
                    isUpdatingOnCancel ? <CircularProgress size={14} color="inherit"/> :
                        <CloseIcon sx={{ fontSize: 16 }} />
                }
                onClick={() => onCancel(invoice.id)}
                sx={{ mt: 0.5, minWidth: 80, px: 1, py: 0.5, fontSize: '0.75rem', lineHeight: 1.2 }}
            >
                {isUpdatingOnCancel ? 'Updating...' : 'Cancel'}
            </Button>
        )}
    </Box>