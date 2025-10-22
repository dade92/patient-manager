package domain.operation.validator

import domain.operation.CreateOperationRequest
import java.math.RoundingMode

class EstimatedAmountEqualToDetailsSumValidator : OperationRequestValidator {
    override fun validate(request: CreateOperationRequest) {
        if (request.patientOperationInfo.details.isNotEmpty() &&
            request.patientOperationInfo.details.sumOf { it.estimatedCost.amount.setScale(2, RoundingMode.HALF_UP) } != request.estimatedCost.amount.setScale(2, RoundingMode.HALF_UP)
        ) {
            throw EstimatedAmountDifferentFromDetailsSumException("Estimated amount does not equal to sum of details estimated costs")
        }
    }
}

data class EstimatedAmountDifferentFromDetailsSumException(override val message: String) : RuntimeException(message)