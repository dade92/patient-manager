package webapp.adapter

import domain.model.OperationType

class OperationTypeResponseAdapter {

    fun adapt(operationType: OperationType): OperationTypeResponse =
        OperationTypeResponse(
            type = operationType.type,
            description = operationType.description,
            estimatedBaseCost = operationType.estimatedBaseCost.toDto()
        )

    fun adaptAll(operationTypes: List<OperationType>): List<OperationTypeResponse> =
        operationTypes.map { adapt(it) }
}
