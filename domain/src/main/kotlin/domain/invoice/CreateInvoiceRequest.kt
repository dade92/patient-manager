package domain.invoice

import domain.model.Money
import domain.model.OperationId
import domain.model.PatientId

data class CreateInvoiceRequest(
    val operationId: OperationId,
    val patientId: PatientId,
    val amount: Money
)
