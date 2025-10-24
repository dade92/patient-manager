package domain.operation.validator

import domain.operation.CreateOperationRequest

interface OperationRequestValidator {
    fun validate(request: CreateOperationRequest)
}