package domain.exceptions

import domain.model.PatientOperation

class OperationTypeAlreadyExistsException(
    val operationType: PatientOperation.Type,
    message: String = "Operation type already exists: ${operationType.type}"
) : RuntimeException(message) {
    override fun toString(): String =
        "OperationTypeAlreadyExistsException(operationType=$operationType, message=${message ?: "No message provided"})"
}
