package domain.model

import domain.model.MoneyBuilder.aMoney
import domain.model.PatientBuilder.aPatientId
import domain.operation.CreateOperationRequest
import java.time.LocalDateTime

object OperationBuilder {

    fun anOperationId(value: String = "OP-123") = OperationId(value)

    fun aPatientOperation(
        id: OperationId = anOperationId(),
        patientId: PatientId = aPatientId(),
        type: OperationType = OperationType.CONSULTATION,
        description: String = "",
        executor: String = "",
        assets: List<String> = emptyList(),
        additionalNotes: List<OperationNote> = emptyList(),
        creationDateTime: LocalDateTime = LocalDateTime.of(2025, 1, 2, 3, 4, 5),
        lastUpdate: LocalDateTime = LocalDateTime.of(2025, 2, 2, 3, 4, 5),
        estimatedCost: Money = aMoney(),
        info: PatientOperationInfo = aPatientOperationInfo()
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
            estimatedCost = estimatedCost,
            info = info
        )

    fun aCreateOperationRequest(
        patientId: PatientId = aPatientId(),
        type: OperationType = OperationType.CONSULTATION,
        description: String = "",
        executor: String = "",
        estimatedCost: Money = aMoney(),
        patientOperationInfo: PatientOperationInfo = aPatientOperationInfo(),
    ) = CreateOperationRequest(
        patientId = patientId,
        type = type,
        description = description,
        executor = executor,
        estimatedCost = estimatedCost,
        patientOperationInfo = patientOperationInfo
    )

    fun anOperationNote(
        content: String = "note",
        creationTime: LocalDateTime = LocalDateTime.now()
    ) = OperationNote(content, creationTime)

    fun aPatientOperationInfo(
        details: List<PatientOperationInfo.Detail> = emptyList()
    ): PatientOperationInfo = PatientOperationInfo(
        details
    )

    fun aDetail(
        toothNumber: Int = 1,
        estimatedCost: Money = aMoney(),
        toothType: ToothType = ToothType.PERMANENT
    ): PatientOperationInfo.Detail = PatientOperationInfo.Detail(
        toothNumber = toothNumber,
        estimatedCost = estimatedCost,
        toothType = toothType
    )
}