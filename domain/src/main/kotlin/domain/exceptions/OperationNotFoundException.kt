package domain.exceptions

import domain.model.OperationId

class OperationNotFoundException(
    val operationId: OperationId? = null,
    message: String = "Operation not found${operationId?.let { " with id $it" } ?: ""}"
) : RuntimeException(message) {
    override fun toString(): String =
        "OperationNotFoundException(patientId=$operationId, message=${message ?: "No message provided"})"
}