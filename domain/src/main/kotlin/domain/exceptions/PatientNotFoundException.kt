package domain.exceptions

import domain.model.PatientId

class PatientNotFoundException(
    val patientId: PatientId?,
    message: String = "Patient not found${patientId?.let { " with id $it" } ?: ""}"
) : RuntimeException(message) {
    override fun toString(): String =
        "PatientNotFoundException(patientId=$patientId, message=${message ?: "No message provided"})"
}