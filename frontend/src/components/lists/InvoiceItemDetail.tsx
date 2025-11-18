import {Box, Typography} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import {idFormatter} from "../../utils/idFormatter";
import {Invoice, InvoiceStatus} from "../../types/invoice";
import React from "react";

interface Props {
    invoice: Invoice;
}

export const InvoiceItemDetail: React.FC<Props> = ({invoice}) =>
    <Box sx={{display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0}} data-testid="invoice-item-detail">
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
            <PaymentIcon color="action"/>
            <Typography variant="subtitle1" noWrap data-testid="invoice-id">
                {idFormatter(invoice.id)}
            </Typography>
        </Box>
        <Box sx={{mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5}}>
            <Typography variant="body2" color="textSecondary" noWrap data-testid="operation-id">
                Operation: {idFormatter(invoice.operationId)}
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap data-testid="created-at">
                Created at: {invoice.createdAt}
            </Typography>
            {invoice.status === InvoiceStatus.PAID && (
                <Typography variant="caption" color="textSecondary" noWrap data-testid="paid-at">
                    PAID at {invoice.updatedAt}
                </Typography>
            )}
        </Box>
    </Box>;
