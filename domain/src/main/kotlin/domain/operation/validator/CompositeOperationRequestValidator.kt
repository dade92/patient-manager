package domain.operation.validator

import domain.operation.CreateOperationRequest

class CompositeOperationRequestValidator(
    private val validators: List<OperationRequestValidator>
): OperationRequestValidator {
    override fun validate(request: CreateOperationRequest) {
        validators.forEach { it.validate(request) }
    }
}