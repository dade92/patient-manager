package domain.model

data class OperationType(
    val type: PatientOperation.Type,
    val description: String,
    val estimatedBaseCost: Money
)
