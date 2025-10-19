package webapp.adapter

import domain.model.InvoiceBuilder.anInvoice
import domain.model.InvoiceBuilder.anInvoiceId
import domain.model.InvoiceStatus
import domain.model.InvoiceStatus.PAID
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.anOperationId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDateTime

class InvoiceResponseAdapterTest {

    private val adapter = InvoiceResponseAdapter()

    @Test
    fun adapt() {
        val invoice = anInvoice(
            id = anInvoiceId(INVOICE_ID),
            operationId = anOperationId(OPERATION_ID),
            amount = aMoney(BigDecimal(AMOUNT), CURRENCY),
            status = PAID,
            creationDateTime = LocalDateTime.of(2025, 3, 15, 14, 30, 45),
            lastUpdate = LocalDateTime.of(2025, 4, 20, 10, 15, 30)
        )

        val expected = InvoiceResponse(
            id = INVOICE_ID,
            operationId = OPERATION_ID,
            amount = MoneyDto(BigDecimal(AMOUNT), CURRENCY),
            status = "PAID",
            createdAt = "15/03/2025 14:30:45",
            updatedAt = "20/04/2025 10:15:30"
        )

        val actual = adapter.adapt(invoice)

        assertEquals(expected, actual)
    }

    companion object {
        private const val INVOICE_ID = "INV-789"
        private const val OPERATION_ID = "OP-456"
        private const val AMOUNT = "350.00"
        private const val CURRENCY = "EUR"
    }
}
