package webapp.adapter

import domain.model.Detail
import domain.model.OperationType
import domain.model.PatientOperationInfo

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
    val patientOperationInfo: PatientOperationInfoDto
)

data class OperationNoteResponse(
    val content: String,
    val createdAt: String
)

data class PatientOperationsResponse(
    val operations: List<OperationResponse>
)

data class PatientOperationInfoDto(
    val details: List<DetailDto>
)

fun PatientOperationInfoDto.toDomain() =
    PatientOperationInfo(details = this.details.map {
        Detail(
            toothNumber = it.toothNumber,
            estimatedCost = it.estimatedCost.toDomain()
        )
    })

data class DetailDto(
    val toothNumber: Int,
    val estimatedCost: MoneyDto
)