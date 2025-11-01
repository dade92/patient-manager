package domain.invoice

import domain.model.Invoice
import domain.model.InvoiceId
import domain.model.InvoiceStatus
import domain.model.OperationId
import domain.model.PatientId

interface InvoiceRepository {
    fun save(invoice: Invoice, patientId: PatientId): Invoice
    fun retrieve(invoiceId: InvoiceId): Invoice?
    fun findByOperationId(operationId: OperationId): List<Invoice>
    fun findByPatientId(patientId: PatientId): List<Invoice>
    fun updateStatus(invoiceId: InvoiceId, status: InvoiceStatus): Invoice?
    fun delete(invoiceId: InvoiceId)
}
