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
    val phoneNumber: String?,
    val address: String?,
    val cityOfResidence: String?,
    val nationality: String?,
    val birthDate: LocalDate,
    val taxCode: String,
    val medicalHistory: String
)
