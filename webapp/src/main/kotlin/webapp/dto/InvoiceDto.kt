package webapp.dto

import java.math.BigDecimal

data class MoneyDto(
    val amount: BigDecimal,
    val currency: String
)

data class CreateInvoiceJsonRequest(
    val operationId: String,
    val amount: MoneyDto,
)

data class UpdateInvoiceStatusRequest(
    val status: String
)

data class InvoiceResponse(
    val id: String,
    val operationId: String,
    val amount: BigDecimal,
    val currency: String,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)
