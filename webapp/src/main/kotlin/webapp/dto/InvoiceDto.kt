package webapp.dto

import java.math.BigDecimal

data class MoneyDto(
    val amount: BigDecimal,
    val currency: String = "USD"
)

data class CreateInvoiceRequestDto(
    val operationId: String,
    val amount: MoneyDto,
)

data class UpdateInvoiceStatusRequestDto(
    val status: String
)

data class InvoiceResponseDto(
    val id: String,
    val operationId: String,
    val amount: BigDecimal,
    val currency: String,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)
