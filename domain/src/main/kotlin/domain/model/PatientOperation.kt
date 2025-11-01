package domain.model

import java.time.LocalDateTime

@JvmInline
value class OperationId(val value: String) {
    override fun toString(): String = value
}

@JvmInline
value class OperationType(val type: String) {
    override fun toString(): String = type

    companion object {
        val CONSULTATION = OperationType("CONSULTATION")
        val SURGERY = OperationType("SURGERY")
        val TREATMENT = OperationType("TREATMENT")
        val FOLLOW_UP = OperationType("FOLLOW_UP")
        val DIAGNOSTIC = OperationType("DIAGNOSTIC")
    }
}

data class PatientOperation(
    val id: OperationId,
    val patientId: PatientId,
    val type: OperationType,
    val description: String,
    val executor: String,
    val assets: List<String>,
    val additionalNotes: List<OperationNote>,
    val creationDateTime: LocalDateTime,
    val lastUpdate: LocalDateTime,
    val estimatedCost: Money,
    val info: PatientOperationInfo
)

data class PatientOperationInfo(
    val details: List<Detail>
) {
    data class Detail(
        val toothNumber: Int,
        val estimatedCost: Money,
        val toothType: ToothType
    )
}

enum class ToothType {
    PERMANENT,
    DECIDUOUS,
}

data class OperationNote(
    val content: String,
    val creationTime: LocalDateTime
)
