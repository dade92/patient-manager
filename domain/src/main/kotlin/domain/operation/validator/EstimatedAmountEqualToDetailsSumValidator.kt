package domain.operation.validator

import domain.operation.CreateOperationRequest

class EstimatedAmountEqualToDetailsSumValidator : OperationRequestValidator {
    override fun validate(request: CreateOperationRequest) {
        if (request.patientOperationInfo.details.isNotEmpty() &&
            request.patientOperationInfo.details.sumOf { it.estimatedCost.amount } != request.estimatedCost.amount
        ) {
            throw IllegalArgumentException("Estimated amount does not equal to sum of details estimated costs")
        }
    }
}