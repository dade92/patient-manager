package domain.model

import java.time.LocalDateTime

@JvmInline
value class OperationId(val value: String) {
    override fun toString(): String = value
}

data class PatientOperation(
    val id: OperationId,
    val patientId: PatientId,
    val type: Type,
    val description: String,
    val executor: String,
    val assets: List<String>,
    val additionalNotes: List<OperationNote>,
    val creationDateTime: LocalDateTime,
    val lastUpdate: LocalDateTime,
    val estimatedCost: Money,
    val info: PatientOperationInfo
) {
    @JvmInline
    value class Type(val type: String) {
        override fun toString(): String = type

        companion object {
            val CONSULTATION = Type("CONSULTATION")
            val SURGERY = Type("SURGERY")
            val TREATMENT = Type("TREATMENT")
            val FOLLOW_UP = Type("FOLLOW_UP")
            val DIAGNOSTIC = Type("DIAGNOSTIC")
        }
    }

}

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
