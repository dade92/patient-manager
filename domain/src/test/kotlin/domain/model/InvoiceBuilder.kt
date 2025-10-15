package domain.model

import domain.invoice.CreateInvoiceRequest
import domain.model.InvoiceStatus.PENDING
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.anOperationId
import domain.model.PatientBuilder.aPatientId
import java.time.LocalDateTime

object InvoiceBuilder {

    fun anInvoiceId() = InvoiceId("INV-123")

    fun anInvoice(
        id: InvoiceId = anInvoiceId(),
        operationId: OperationId = anOperationId(),
        amount: Money = aMoney(),
        status: InvoiceStatus = PENDING,
        creationDateTime: LocalDateTime = LocalDateTime.of(2025, 1, 2, 3, 4, 5),
        lastUpdate: LocalDateTime = LocalDateTime.of(2025, 1, 2, 3, 4, 5),
    ) = Invoice(
        id = id,
        operationId = operationId,
        amount = amount,
        status = status,
        creationDateTime = creationDateTime,
        lastUpdate = lastUpdate
    )

    fun aCreateInvoiceRequest(
        operationId: OperationId = anOperationId(),
        patientId: PatientId = aPatientId(),
        amount: Money = aMoney()
    ) = CreateInvoiceRequest(
        operationId = operationId,
        patientId = patientId,
        amount = amount
    )
}