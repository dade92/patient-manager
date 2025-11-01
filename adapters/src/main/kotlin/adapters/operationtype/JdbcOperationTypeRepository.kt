package adapters.operationtype

import domain.exceptions.OperationTypeAlreadyExistsException
import domain.model.Money
import domain.model.OperationType
import domain.model.PatientOperation
import domain.operationtype.OperationTypeRepository
import java.sql.ResultSet
import javax.sql.DataSource

class JdbcOperationTypeRepository(
    private val dataSource: DataSource
) : OperationTypeRepository {

    override fun save(operationType: OperationType): OperationType {
        val existingOperationType = findByType(operationType.type)

        if (existingOperationType != null) {
            throw OperationTypeAlreadyExistsException(operationType.type)
        }

        return insert(operationType)
    }

    override fun retrieveAll(): List<OperationType> {
        val sql = """
            SELECT id, operation_type, estimated_base_cost, estimated_base_cost_currency, description
            FROM OPERATION_TYPE
            ORDER BY operation_type
        """.trimIndent()

        val operationTypes = mutableListOf<OperationType>()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.executeQuery().use { resultSet ->
                    while (resultSet.next()) {
                        operationTypes.add(mapToOperationType(resultSet))
                    }
                }
            }
        }

        return operationTypes
    }

    private fun findByType(type: PatientOperation.Type): OperationType? {
        val sql = """
            SELECT id, operation_type, estimated_base_cost, estimated_base_cost_currency, description
            FROM OPERATION_TYPE
            WHERE operation_type = ?
        """.trimIndent()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, type.type)
                statement.executeQuery().use { resultSet ->
                    if (resultSet.next()) {
                        return mapToOperationType(resultSet)
                    }
                }
            }
        }

        return null
    }

    private fun insert(operationType: OperationType): OperationType {
        val sql = """
            INSERT INTO OPERATION_TYPE (operation_type, estimated_base_cost, estimated_base_cost_currency, description)
            VALUES (?, ?, ?, ?)
        """.trimIndent()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, operationType.type.type)
                statement.setBigDecimal(2, operationType.estimatedBaseCost.amount)
                statement.setString(3, operationType.estimatedBaseCost.currency)
                statement.setString(4, operationType.description)
                statement.executeUpdate()
            }
        }

        return operationType
    }

    private fun mapToOperationType(resultSet: ResultSet): OperationType =
        OperationType(
            type = PatientOperation.Type(resultSet.getString("operation_type")),
            description = resultSet.getString("description"),
            estimatedBaseCost = Money(
                amount = resultSet.getBigDecimal("estimated_base_cost"),
                currency = resultSet.getString("estimated_base_cost_currency")
            )
        )
}