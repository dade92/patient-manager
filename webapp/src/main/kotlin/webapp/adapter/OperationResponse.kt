package webapp.adapter

import domain.model.OperationType
import domain.model.PatientOperationInfo
import domain.model.ToothType

data class OperationResponse(
    val id: String,
    val patientId: String,
    val type: OperationType,
    val description: String,
    val executor: String,
    val assets: List<String>,
    val additionalNotes: List<OperationNoteResponse>,
    val createdAt: String,
    val updatedAt: String,
    val estimatedCost: MoneyDto,
    val patientOperationInfo: PatientOperationInfoJson
)

data class OperationNoteResponse(
    val content: String,
    val createdAt: String
)

data class PatientOperationsResponse(
    val operations: List<OperationResponse>
)

data class PatientOperationInfoJson(
    val details: List<DetailResponse>
)

fun PatientOperationInfoJson.toDomain() =
    PatientOperationInfo(details = this.details.map {
        PatientOperationInfo.Detail(
            toothNumber = it.toothNumber,
            estimatedCost = it.estimatedCost.toDomain(),
            toothType = ToothType.valueOf(it.toothType)
        )
    })

data class DetailResponse(
    val toothNumber: Int,
    val estimatedCost: MoneyDto,
    val toothType: String
)