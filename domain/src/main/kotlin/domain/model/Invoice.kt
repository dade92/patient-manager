package domain.model

import java.math.BigDecimal
import java.time.LocalDateTime

enum class InvoiceStatus {
    PENDING,
    PAID,
    CANCELLED
}

data class Invoice(
    val id: InvoiceId,
    val operationId: OperationId,
    val amount: BigDecimal,
    val status: InvoiceStatus,
    val creationDateTime: LocalDateTime,
    val lastUpdateDateTime: LocalDateTime
)
