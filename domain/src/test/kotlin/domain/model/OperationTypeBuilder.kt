package domain.model

import domain.model.MoneyBuilder.aMoney
import domain.model.PatientOperation.Type.Companion.CONSULTATION

object OperationTypeBuilder {

    fun anOperationType(
        type: PatientOperation.Type = CONSULTATION,
        description: String = "",
        estimatedBaseCost: Money = aMoney()
    ) = OperationType(
        type = type,
        description = description,
        estimatedBaseCost = estimatedBaseCost
    )
}
