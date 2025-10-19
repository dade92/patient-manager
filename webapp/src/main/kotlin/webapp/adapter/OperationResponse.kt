package webapp.adapter

import domain.model.OperationType
import webapp.controller.MoneyDto

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

data class DetailDto(
    val toothNumber: Int,
    val estimatedCost: MoneyDto
)