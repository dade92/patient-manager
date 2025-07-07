import {InvoiceStatus} from "../types/invoice";

export const getInvoiceStatusColor = (status: InvoiceStatus) => {
    switch (status) {
        case InvoiceStatus.PAID:
            return 'success';
        case InvoiceStatus.PENDING:
            return 'warning';
        case InvoiceStatus.CANCELLED:
            return 'error';
    }
};

