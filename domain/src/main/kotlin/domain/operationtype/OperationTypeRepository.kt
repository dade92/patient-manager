package domain.operationtype

import domain.model.OperationType

interface OperationTypeRepository {
    fun save(operationType: OperationType): OperationType
    fun retrieveAll(): List<OperationType>
}
