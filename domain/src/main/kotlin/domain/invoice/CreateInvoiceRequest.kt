package domain.invoice

import domain.model.Money
import domain.model.OperationId

data class CreateInvoiceRequest(
    val operationId: OperationId,
    val amount: Money
)
