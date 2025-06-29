package domain.model

import java.time.LocalDateTime

@JvmInline
value class OperationId(val value: String) {
    override fun toString(): String = value
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
    val lastUpdate: LocalDateTime
)

enum class OperationType {
    CONSULTATION,
    SURGERY,
    TREATMENT,
    FOLLOW_UP,
    DIAGNOSTIC
}

data class OperationNote(
    val content: String,
    val creationTime: LocalDateTime = LocalDateTime.now()
)
