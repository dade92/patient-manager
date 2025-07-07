export const getInvoiceStatusColor = (status: string) => {
    switch (status) {
        case 'PAID':
            return 'success';
        case 'PENDING':
            return 'warning';
        case 'CANCELLED':
            return 'error';
        default:
            return 'default';
    }
};

