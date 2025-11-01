package adapters.operationtype

import domain.model.OperationType
import domain.operationtype.OperationTypeRepository

class JdbcOperationTypeRepository: OperationTypeRepository {
    override fun save(operationType: OperationType): OperationType {
        TODO("Not yet implemented")
    }

    override fun retrieveAll(): List<OperationType> {
        TODO("Not yet implemented")
    }
}