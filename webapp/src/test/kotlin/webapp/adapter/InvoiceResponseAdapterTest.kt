package webapp.adapter

import domain.model.InvoiceBuilder.anInvoice
import domain.model.InvoiceId
import domain.model.InvoiceStatus
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
            id = InvoiceId("INV-789"),
            operationId = anOperationId("OP-456"),
            amount = aMoney(BigDecimal("350.00"), "EUR"),
            status = InvoiceStatus.PAID,
            creationDateTime = LocalDateTime.of(2025, 3, 15, 14, 30, 45),
            lastUpdate = LocalDateTime.of(2025, 4, 20, 10, 15, 30)
        )

        val expected = InvoiceResponse(
            id = "INV-789",
            operationId = "OP-456",
            amount = MoneyDto(BigDecimal("350.00"), "EUR"),
            status = "PAID",
            createdAt = "15/03/2025 14:30:45",
            updatedAt = "20/04/2025 10:15:30"
        )

        val actual = adapter.adapt(invoice)

        assertEquals(expected, actual)
    }
}
