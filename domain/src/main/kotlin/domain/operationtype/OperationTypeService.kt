package domain.operationtype

import domain.model.OperationType

class OperationTypeService(
    private val operationTypeRepository: OperationTypeRepository
) {

    fun save(operationType: OperationType): OperationType = operationTypeRepository.save(operationType)

    fun retrieve(): List<OperationType> = operationTypeRepository.retrieveAll()
}
