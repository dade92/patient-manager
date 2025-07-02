package webapp.dto

import java.math.BigDecimal

data class CreateInvoiceRequestDto(
    val operationId: String,
    val amount: BigDecimal
)

data class UpdateInvoiceStatusRequestDto(
    val status: String
)

data class InvoiceResponseDto(
    val id: String,
    val operationId: String,
    val amount: BigDecimal,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)
