package domain.invoice

import domain.model.Invoice
import domain.model.InvoiceId
import domain.model.OperationId

interface InvoiceRepository {
    fun save(invoice: Invoice): Invoice
    fun retrieve(invoiceId: InvoiceId): Invoice?
    fun findByOperationId(operationId: OperationId): List<Invoice>
    fun updateStatus(invoiceId: InvoiceId, status: domain.model.InvoiceStatus): Invoice?
}
