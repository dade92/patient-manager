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
    val assets: List<String> = emptyList(),
    val additionalNotes: List<OperationNote> = emptyList(),
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
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
    val createdAt: LocalDateTime = LocalDateTime.now()
)
