package domain.invoice

import domain.model.OperationId
import java.math.BigDecimal

data class CreateInvoiceRequest(
    val operationId: OperationId,
    val amount: BigDecimal
)
