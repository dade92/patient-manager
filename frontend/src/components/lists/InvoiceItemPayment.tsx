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
    onChangeInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
}

export const InvoiceItemPayment: React.FC<Props> = ({invoice, isUpdatingOnPaid, isUpdatingOnCancel, onChangeInvoiceStatus}) =>
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, minWidth: 120, ml: 2}} data-testid="invoice-item-payment">
        <Typography sx={{ fontWeight: 400 }} noWrap data-testid="invoice-amount">
            {formatAmount(invoice.amount.amount, invoice.amount.currency)}
        </Typography>
        <Chip
            label={invoice.status}
            size="small"
            color={getInvoiceStatusColor(invoice.status)}
            variant="outlined"
            data-testid="invoice-status-chip"
        />
        {invoice.status === InvoiceStatus.PENDING && (
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }} data-testid="invoice-payment-buttons">
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={
                        isUpdatingOnPaid ? <CircularProgress size={14} color="inherit"/> :
                            <CheckCircleIcon sx={{ fontSize: 16 }} />
                    }
                    onClick={() => onChangeInvoiceStatus(invoice.id, InvoiceStatus.PAID)}
                    sx={{ minWidth: 80, px: 1, py: 0.5, fontSize: '0.75rem', lineHeight: 1.2 }}
                    disabled={isUpdatingOnPaid || isUpdatingOnCancel}
                    data-testid="mark-as-paid-button"
                >
                    {isUpdatingOnPaid ? 'Updating...' : 'Mark as Paid'}
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="error"
                    startIcon={
                        isUpdatingOnCancel ? <CircularProgress size={14} color="inherit"/> :
                            <CloseIcon sx={{ fontSize: 16 }} />
                    }
                    onClick={() => onChangeInvoiceStatus(invoice.id, InvoiceStatus.CANCELLED)}
                    sx={{ minWidth: 80, px: 1, py: 0.5, fontSize: '0.75rem', lineHeight: 1.2 }}
                    disabled={isUpdatingOnPaid || isUpdatingOnCancel}
                    data-testid="cancel-invoice-button"
                >
                    {isUpdatingOnCancel ? 'Updating...' : 'Cancel'}
                </Button>
            </Box>
        )}
    </Box>