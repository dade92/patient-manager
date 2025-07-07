package adapters.invoice

import domain.invoice.InvoiceRepository
import domain.model.Invoice
import domain.model.InvoiceId
import domain.model.InvoiceStatus
import domain.model.Money
import domain.model.OperationId
import domain.model.PatientId
import domain.utils.DateTimeProvider
import java.sql.ResultSet
import java.sql.Timestamp
import javax.sql.DataSource

class JdbcInvoiceRepository(
    private val dataSource: DataSource,
    private val dateTimeProvider: DateTimeProvider
) : InvoiceRepository {

    override fun save(invoice: Invoice, patientId: PatientId): Invoice {
        val existingInvoice = retrieve(invoice.id)
        return if (existingInvoice == null) {
            insertInvoice(invoice, patientId)
        } else {
            updateInvoice(invoice)
        }
    }

    override fun retrieve(invoiceId: InvoiceId): Invoice? {
        val sql = "SELECT invoice_id, operation_id, patient_id, amount, currency, status, created_at, updated_at FROM INVOICE WHERE invoice_id = ?"

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
        val sql = "SELECT invoice_id, operation_id, patient_id, amount, currency, status, created_at, updated_at FROM INVOICE WHERE operation_id = ? ORDER BY created_at DESC"
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

    override fun findByPatientId(patientId: PatientId): List<Invoice> {
        val sql = "SELECT invoice_id, operation_id, patient_id, amount, currency, status, created_at, updated_at FROM INVOICE WHERE patient_id = ? ORDER BY created_at DESC"
        val invoices = mutableListOf<Invoice>()

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, patientId.value)
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
            lastUpdate = dateTimeProvider.now()
        )
        return updateInvoice(updatedInvoice)
    }

    private fun insertInvoice(invoice: Invoice, patientId: PatientId): Invoice {
        val sql = """
            INSERT INTO INVOICE (invoice_id, operation_id, patient_id, amount, currency, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setString(1, invoice.id.value)
                statement.setString(2, invoice.operationId.value)
                statement.setString(3, patientId.value)
                statement.setBigDecimal(4, invoice.amount.amount)
                statement.setString(5, invoice.amount.currency)
                statement.setString(6, invoice.status.name)
                statement.setTimestamp(7, Timestamp.valueOf(invoice.creationDateTime))
                statement.setTimestamp(8, Timestamp.valueOf(invoice.lastUpdate))
                statement.executeUpdate()
            }
        }

        return invoice
    }

    private fun updateInvoice(invoice: Invoice): Invoice {
        val sql = """
            UPDATE INVOICE
            SET amount = ?, currency = ?, status = ?, updated_at = ?
            WHERE invoice_id = ?
        """

        dataSource.connection.use { connection ->
            connection.prepareStatement(sql).use { statement ->
                statement.setBigDecimal(1, invoice.amount.amount)
                statement.setString(2, invoice.amount.currency)
                statement.setString(3, invoice.status.name)
                statement.setTimestamp(4, Timestamp.valueOf(invoice.lastUpdate))
                statement.setString(5, invoice.id.value)
                statement.executeUpdate()
            }
        }

        return invoice
    }

    private fun mapToInvoice(resultSet: ResultSet): Invoice =
        Invoice(
            id = InvoiceId(resultSet.getString("invoice_id")),
            operationId = OperationId(resultSet.getString("operation_id")),
            amount = Money(
                amount = resultSet.getBigDecimal("amount"),
                currency = resultSet.getString("currency")
            ),
            status = InvoiceStatus.valueOf(resultSet.getString("status")),
            creationDateTime = resultSet.getTimestamp("created_at").toLocalDateTime(),
            lastUpdate = resultSet.getTimestamp("updated_at").toLocalDateTime()
        )
}
