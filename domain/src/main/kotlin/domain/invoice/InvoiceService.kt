package domain.invoice

import domain.generator.InvoiceIdGenerator
import domain.model.Invoice
import domain.model.InvoiceId
import domain.model.InvoiceStatus
import domain.model.InvoiceStatus.PENDING
import domain.model.OperationId
import domain.operation.OperationRepository
import domain.utils.DateTimeProvider

class InvoiceService(
    private val invoiceRepository: InvoiceRepository,
    private val operationRepository: OperationRepository,
    private val invoiceIdGenerator: InvoiceIdGenerator,
    private val dateTimeProvider: DateTimeProvider
) {
    fun createInvoice(request: CreateInvoiceRequest): Invoice {
        val operation = operationRepository.retrieve(request.operationId)
            ?: throw IllegalArgumentException("Operation with ID ${request.operationId.value} does not exist")

        val now = dateTimeProvider.now()
        val invoice = Invoice(
            id = invoiceIdGenerator.generate(),
            operationId = operation.id,
            amount = request.amount,
            status = PENDING,
            creationDateTime = now,
            lastUpdateDateTime = now
        )

        return invoiceRepository.save(invoice)
    }

    fun getInvoice(invoiceId: InvoiceId): Invoice? =
        invoiceRepository.retrieve(invoiceId)

    fun getInvoicesForOperation(operationId: OperationId): List<Invoice> =
        invoiceRepository.findByOperationId(operationId)

    fun updateInvoiceStatus(invoiceId: InvoiceId, newStatus: InvoiceStatus): Invoice? =
        invoiceRepository.updateStatus(invoiceId, newStatus)
}
