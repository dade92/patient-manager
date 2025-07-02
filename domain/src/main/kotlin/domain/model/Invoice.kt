package domain.model

import java.time.LocalDateTime

enum class InvoiceStatus {
    PENDING,
    PAID,
    CANCELLED
}

data class Invoice(
    val id: InvoiceId,
    val operationId: OperationId,
    val amount: Money,
    val status: InvoiceStatus,
    val creationDateTime: LocalDateTime,
    val lastUpdateDateTime: LocalDateTime
)

@JvmInline
value class InvoiceId(val value: String) {
    override fun toString(): String = value
}