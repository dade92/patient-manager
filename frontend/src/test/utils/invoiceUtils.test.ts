import {getInvoiceStatusColor} from '../../utils/invoiceUtils';
import {InvoiceStatus} from '../../types/invoice';

describe('invoiceUtils', () => {
    it('should return correct color for each invoice status', () => {
        const paidColor = getInvoiceStatusColor(InvoiceStatus.PAID);
        expect(paidColor).toBe('success');

        const pendingColor = getInvoiceStatusColor(InvoiceStatus.PENDING);
        expect(pendingColor).toBe('warning');

        const cancelledColor = getInvoiceStatusColor(InvoiceStatus.CANCELLED);
        expect(cancelledColor).toBe('error');
    });
});
