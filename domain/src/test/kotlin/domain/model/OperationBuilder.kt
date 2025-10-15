package domain.model

import domain.model.MoneyBuilder.aMoney
import domain.model.PatientBuilder.aPatientId
import java.time.LocalDateTime

object OperationBuilder {

    fun anOperationId() = OperationId("OP-123")

    fun aPatientOperation(
        id: OperationId = anOperationId(),
        patientId: PatientId = aPatientId(),
        type: OperationType = OperationType.CONSULTATION,
        description: String = "description",
        executor: String = "executor",
        assets: List<String> = emptyList(),
        additionalNotes: List<OperationNote> = emptyList(),
        creationDateTime: LocalDateTime = LocalDateTime.of(2025, 1, 2, 3, 4, 5),
        lastUpdate: LocalDateTime = LocalDateTime.of(2025, 2, 2, 3, 4, 5),
        estimatedCost: Money = aMoney()
    ) =
        PatientOperation(
            id = id,
            patientId = patientId,
            type = type,
            description = description,
            executor = executor,
            assets = assets,
            additionalNotes = additionalNotes,
            creationDateTime = creationDateTime,
            lastUpdate = lastUpdate,
            estimatedCost = estimatedCost
        )

}