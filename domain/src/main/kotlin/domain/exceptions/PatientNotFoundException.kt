package domain.exceptions

import domain.model.PatientId

class PatientNotFoundException(
    val patientId: PatientId? = null,
    message: String = "Patient not found${patientId?.let { " with id $it" } ?: ""}"
) : RuntimeException(message) {
    override fun toString(): String {
        return "PatientNotFoundException(patientId=$patientId, message=${message ?: "No message provided"})"
    }
}