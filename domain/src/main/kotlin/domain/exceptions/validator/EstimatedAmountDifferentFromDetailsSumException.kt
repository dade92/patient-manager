package domain.exceptions.validator

data class EstimatedAmountDifferentFromDetailsSumException(override val message: String) : RuntimeException(message)