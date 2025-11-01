package webapp.adapter

import domain.model.PatientOperation

data class CreateOperationTypeRequest(
    val type: PatientOperation.Type,
    val description: String,
    val estimatedBaseCost: MoneyDto
)

data class OperationTypeResponse(
    val type: PatientOperation.Type,
    val description: String,
    val estimatedBaseCost: MoneyDto
)

data class OperationTypeListResponse(
    val types: List<OperationTypeResponse>
)
