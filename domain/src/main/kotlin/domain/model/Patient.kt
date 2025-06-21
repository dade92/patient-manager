package domain.model

import java.time.LocalDate

@JvmInline
value class PatientId(val value: String) {
    override fun toString(): String = value
}

data class Patient(
    val id: PatientId,
    val name: String,
    val email: String,
    val phoneNumber: String? = null,
    val address: String? = null,
    val cityOfResidence: String? = null,
    val nationality: String? = null,
    val birthDate: LocalDate
)
