package adapters.invoice

import domain.invoice.InvoiceRepository
import domain.model.Invoice
import domain.model.InvoiceId
import domain.model.InvoiceStatus
import domain.model.OperationId
import domain.utils.DateTimeProvider
import java.sql.ResultSet
import java.sql.Timestamp
import javax.sql.DataSource

class JdbcInvoiceRepository(
    private val dataSource: DataSource,
    private val dateTimeProvider: DateTimeProvider
) : InvoiceRepository {

    override fun save(invoice: Invoice): Invoice {
        val existingInvoice = retrieve(invoice.id)

        return if (existingInvoice == null) {
            insertInvoice(invoice)
        } else {
            updateInvoice(invoice)
        }
    }

    override fun retrieve(invoiceId: InvoiceId): Invoice? {
        val sql =
            "SELECT invoice_id, operation_id, amount, status, created_at, updated_at FROM INVOICE WHERE invoice_id = ?"

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, invoiceId.value)
                statement.executeQuery().use { resultSet ->
                    if (resultSet.next()) {
                        return mapToInvoice(resultSet)
                    }
                }
            }
        }

        return null
    }

    override fun findByOperationId(operationId: OperationId): List<Invoice> {
        val sql =
            "SELECT invoice_id, operation_id, amount, status, created_at, updated_at FROM INVOICE WHERE operation_id = ? ORDER BY created_at DESC"
        val invoices = mutableListOf<Invoice>()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, operationId.value)
                statement.executeQuery().use { resultSet ->
                    while (resultSet.next()) {
                        invoices.add(mapToInvoice(resultSet))
                    }
                }
            }
        }

        return invoices
    }

    override fun updateStatus(invoiceId: InvoiceId, status: InvoiceStatus): Invoice? {
        val invoice = retrieve(invoiceId) ?: return null

        val updatedInvoice = invoice.copy(
            status = status,
            lastUpdateDateTime = dateTimeProvider.now()
        )

        return updateInvoice(updatedInvoice)
    }

    private fun insertInvoice(invoice: Invoice): Invoice {
        val sql = """
            INSERT INTO INVOICE (invoice_id, operation_id, amount, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, invoice.id.value)
                statement.setString(2, invoice.operationId.value)
                statement.setBigDecimal(3, invoice.amount)
                statement.setString(4, invoice.status.name)
                statement.setTimestamp(5, Timestamp.valueOf(invoice.creationDateTime))
                statement.setTimestamp(6, Timestamp.valueOf(invoice.lastUpdateDateTime))
                statement.executeUpdate()
            }
        }

        return invoice
    }

    private fun updateInvoice(invoice: Invoice): Invoice {
        val sql = """
            UPDATE INVOICE
            SET amount = ?, status = ?, updated_at = ?
            WHERE invoice_id = ?
        """

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setBigDecimal(1, invoice.amount)
                statement.setString(2, invoice.status.name)
                statement.setTimestamp(3, Timestamp.valueOf(invoice.lastUpdateDateTime))
                statement.setString(4, invoice.id.value)
                statement.executeUpdate()
            }
        }

        return invoice
    }

    private fun mapToInvoice(resultSet: ResultSet): Invoice =
        Invoice(
            id = InvoiceId(resultSet.getString("invoice_id")),
            operationId = OperationId(resultSet.getString("operation_id")),
            amount = resultSet.getBigDecimal("amount"),
            status = InvoiceStatus.valueOf(resultSet.getString("status")),
            creationDateTime = resultSet.getTimestamp("created_at").toLocalDateTime(),
            lastUpdateDateTime = resultSet.getTimestamp("updated_at").toLocalDateTime()
        )
}
