package webapp.adapter

import domain.model.Invoice
import java.time.format.DateTimeFormatter

class InvoiceResponseAdapter {
    fun adapt(invoice: Invoice): InvoiceResponse =
        InvoiceResponse(
            id = invoice.id.value,
            operationId = invoice.operationId.value,
            amount = invoice.amount.toDto(),
            status = invoice.status.name,
            createdAt = invoice.creationDateTime.format(DATE_FORMATTER),
            updatedAt = invoice.lastUpdate.format(DATE_FORMATTER)
        )

    companion object {
        private val DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
    }
}