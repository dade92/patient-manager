package adapters.operation

import domain.model.*
import domain.operation.OperationRepository
import domain.utils.DateTimeProvider
import java.math.BigDecimal
import java.sql.Connection
import java.sql.ResultSet
import java.sql.Timestamp
import javax.sql.DataSource

class JdbcOperationRepository(
    private val dataSource: DataSource,
    private val dateTimeProvider: DateTimeProvider
) : OperationRepository {

    override fun save(operation: PatientOperation): PatientOperation {
        val existingOperation = retrieve(operation.id)

        return if (existingOperation == null) {
            insertOperation(operation)
        } else {
            updateOperation(operation)
        }
    }

    override fun retrieve(operationId: OperationId): PatientOperation? {
        val sql =
            """SELECT 
                | operation_id, 
                | patient_id,
                | type,
                | description,
                | executor,
                | created_at,
                | updated_at,
                | estimated_cost 
                | FROM OPERATION 
                | WHERE operation_id = ?
            """.trimMargin()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, operationId.value)
                statement.executeQuery().use { resultSet ->
                    if (resultSet.next()) {
                        return mapToOperation(resultSet, connection)
                    }
                }
            }
        }

        return null
    }

    override fun findByPatientId(patientId: PatientId): List<PatientOperation> {
        val sql =
            """SELECT 
                | operation_id,
                | patient_id,
                | type, 
                | description, 
                | executor, 
                | created_at, 
                | updated_at, 
                | estimated_cost 
                | FROM OPERATION 
                | WHERE patient_id = ? ORDER BY created_at DESC LIMIT 10
            """.trimMargin()
        val operations = mutableListOf<PatientOperation>()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, patientId.value)
                statement.executeQuery().use { resultSet ->
                    while (resultSet.next()) {
                        operations.add(mapToOperation(resultSet, connection))
                    }
                }
            }
        }

        return operations
    }

    override fun addNote(operationId: OperationId, note: String): PatientOperation? {
        dataSource.connection.use { connection ->
            connection.prepareStatement(
                """INSERT INTO OPERATION_NOTE (operation_id, content, created_at) VALUES (?, ?, ?)"""
            ).use { statement ->
                statement.setString(1, operationId.value)
                statement.setString(2, note)
                statement.setTimestamp(3, Timestamp.valueOf(dateTimeProvider.now()))
                statement.executeUpdate()
            }

            connection.prepareStatement(
                """UPDATE OPERATION SET updated_at = ? WHERE operation_id = ?"""
            ).use { statement ->
                statement.setTimestamp(1, Timestamp.valueOf(dateTimeProvider.now()))
                statement.setString(2, operationId.value)
                statement.executeUpdate()
            }
        }

        return retrieve(operationId)
    }

    override fun addAsset(operationId: OperationId, assetName: String): PatientOperation? {
        dataSource.connection.use { connection ->
            connection.prepareStatement(
                """INSERT INTO OPERATION_ASSET (operation_id, asset_name) VALUES (?, ?)"""
            ).use { statement ->
                statement.setString(1, operationId.value)
                statement.setString(2, assetName)
                statement.executeUpdate()
            }

            connection.prepareStatement(
                """UPDATE OPERATION SET updated_at = ? WHERE operation_id = ?"""
            ).use { statement ->
                statement.setTimestamp(1, Timestamp.valueOf(dateTimeProvider.now()))
                statement.setString(2, operationId.value)
                statement.executeUpdate()
            }
        }

        return retrieve(operationId)
    }

    private fun insertOperation(operation: PatientOperation): PatientOperation {
        dataSource.connection.use { connection ->
            connection.prepareStatement(
                """
                INSERT INTO OPERATION (operation_id, patient_id, type, description, executor, created_at, updated_at, estimated_cost)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """
            ).use { statement ->
                statement.setString(1, operation.id.value)
                statement.setString(2, operation.patientId.value)
                statement.setString(3, operation.type.name)
                statement.setString(4, operation.description)
                statement.setString(5, operation.executor)
                statement.setTimestamp(6, Timestamp.valueOf(operation.creationDateTime))
                statement.setTimestamp(7, Timestamp.valueOf(operation.lastUpdate))
                statement.setBigDecimal(8, operation.estimatedCost.amount)
                statement.executeUpdate()
            }

            for (asset in operation.assets) {
                connection.prepareStatement(
                    """INSERT INTO OPERATION_ASSET (operation_id, asset_name) VALUES (?, ?)"""
                ).use { statement ->
                    statement.setString(1, operation.id.value)
                    statement.setString(2, asset)
                    statement.executeUpdate()
                }
            }

            for (note in operation.additionalNotes) {
                connection.prepareStatement(
                    """INSERT INTO OPERATION_NOTE (operation_id, content, created_at) VALUES (?, ?, ?)"""
                ).use { statement ->
                    statement.setString(1, operation.id.value)
                    statement.setString(2, note.content)
                    statement.setTimestamp(3, Timestamp.valueOf(note.creationTime))
                    statement.executeUpdate()
                }
            }
        }

        return operation
    }

    private fun updateOperation(operation: PatientOperation): PatientOperation {
        dataSource.connection.use { connection ->
            connection.prepareStatement(
                """
                UPDATE OPERATION
                SET type = ?, description = ?, executor = ?, updated_at = ?
                WHERE operation_id = ?
                """
            ).use { statement ->
                statement.setString(1, operation.type.name)
                statement.setString(2, operation.description)
                statement.setString(3, operation.executor)
                statement.setTimestamp(4, Timestamp.valueOf(operation.lastUpdate))
                statement.setString(5, operation.id.value)
                statement.executeUpdate()
            }

            connection.prepareStatement(
                """DELETE FROM OPERATION_ASSET WHERE operation_id = ?"""
            ).use { statement ->
                statement.setString(1, operation.id.value)
                statement.executeUpdate()
            }

            for (asset in operation.assets) {
                connection.prepareStatement(
                    """INSERT INTO OPERATION_ASSET (operation_id, asset_name) VALUES (?, ?)"""
                ).use { statement ->
                    statement.setString(1, operation.id.value)
                    statement.setString(2, asset)
                    statement.executeUpdate()
                }
            }
        }

        return operation
    }

    private fun mapToOperation(resultSet: ResultSet, connection: Connection): PatientOperation {
        val operationId = OperationId(resultSet.getString("operation_id"))

        val assets = getOperationAssets(operationId, connection)

        val additionalNotes = getOperationNotes(operationId, connection)

        return PatientOperation(
            id = operationId,
            patientId = PatientId(resultSet.getString("patient_id")),
            type = OperationType.valueOf(resultSet.getString("type")),
            description = resultSet.getString("description"),
            executor = resultSet.getString("executor"),
            assets = assets,
            additionalNotes = additionalNotes,
            creationDateTime = resultSet.getTimestamp("created_at").toLocalDateTime(),
            lastUpdate = resultSet.getTimestamp("updated_at").toLocalDateTime(),
            estimatedCost = Money(resultSet.getBigDecimal("estimated_cost")),
            info = PatientOperationInfo(emptyList())
        )
    }

    private fun getOperationAssets(operationId: OperationId, connection: Connection): List<String> {
        val assets = mutableListOf<String>()
        connection.prepareStatement(
            """SELECT asset_name FROM OPERATION_ASSET WHERE operation_id = ?"""
        ).use { statement ->
            statement.setString(1, operationId.value)
            statement.executeQuery().use { resultSet ->
                while (resultSet.next()) {
                    assets.add(resultSet.getString("asset_name"))
                }
            }
        }
        return assets
    }

    private fun getOperationNotes(operationId: OperationId, connection: Connection): List<OperationNote> {
        val notes = mutableListOf<OperationNote>()
        connection.prepareStatement(
            """SELECT content, created_at FROM OPERATION_NOTE WHERE operation_id = ? ORDER BY created_at DESC"""
        ).use { statement ->
            statement.setString(1, operationId.value)
            statement.executeQuery().use { resultSet ->
                while (resultSet.next()) {
                    notes.add(
                        OperationNote(
                            content = resultSet.getString("content"),
                            creationTime = resultSet.getTimestamp("created_at").toLocalDateTime()
                        )
                    )
                }
            }
        }
        return notes
    }
}