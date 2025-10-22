package domain.operation.validator

import domain.model.round
import domain.operation.CreateOperationRequest

class EstimatedAmountEqualToDetailsSumValidator : OperationRequestValidator {
    override fun validate(request: CreateOperationRequest) {
        if (request.patientOperationInfo.details.isNotEmpty() &&
            request.patientOperationInfo.details.sumOf { it.estimatedCost.amount.round() } != request.estimatedCost.amount.round()
        ) {
            throw EstimatedAmountDifferentFromDetailsSumException("Estimated amount does not equal to sum of details estimated costs")
        }
    }
}

data class EstimatedAmountDifferentFromDetailsSumException(override val message: String) : RuntimeException(message)