package adapters.invoice

import domain.model.InvoiceBuilder.anInvoice
import domain.model.InvoiceBuilder.anInvoiceId
import domain.model.InvoiceStatus
import domain.model.InvoiceStatus.PAID
import domain.model.InvoiceStatus.PENDING
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.anOperationId
import domain.model.PatientBuilder.aPatientId
import domain.utils.DateTimeProvider
import org.h2.jdbcx.JdbcDataSource
import org.h2.tools.RunScript
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.io.InputStreamReader
import java.math.BigDecimal
import java.nio.charset.StandardCharsets
import java.time.LocalDateTime
import javax.sql.DataSource

class JdbcInvoiceRepositoryTest {

    private lateinit var dataSource: DataSource
    private lateinit var repository: JdbcInvoiceRepository
    private val dateTimeProvider = FixedDateTimeProvider(FIXED_NOW)

    @BeforeEach
    fun setUp() {
        dataSource = JdbcDataSource().apply { setUrl(DB_URL) }

        runSql(SCHEMA_SQL)
        runSql(DATA_SQL)

        repository = JdbcInvoiceRepository(dataSource, dateTimeProvider)
    }

    @AfterEach
    fun tearDown() {
    }

    @Test
    fun `retrieve returns invoice when present`() {
        val result = repository.retrieve(INVOICE_ID_1)

        val expected = anInvoice(
            id = INVOICE_ID_1,
            operationId = OPERATION_ID,
            amount = aMoney(BigDecimal("100.00")),
            status = PENDING,
            creationDateTime = LocalDateTime.of(2025, 1, 1, 12, 0, 0),
            lastUpdate = LocalDateTime.of(2025, 1, 1, 12, 0, 0)
        )

        assertEquals(expected, result)
    }

    @Test
    fun `findByOperationId returns invoices ordered by creation desc`() {
        val result = repository.findByOperationId(OPERATION_ID)

        val expected = listOf(
            anInvoice(
                id = INVOICE_ID_2,
                operationId = OPERATION_ID,
                amount = aMoney(BigDecimal("150.50")),
                status = PAID,
                creationDateTime = LocalDateTime.of(2025, 1, 2, 9, 0, 0),
                lastUpdate = LocalDateTime.of(2025, 1, 2, 10, 0, 0)
            ),
            anInvoice(
                id = INVOICE_ID_1,
                operationId = OPERATION_ID,
                amount = aMoney(BigDecimal("100.00")),
                status = PENDING,
                creationDateTime = LocalDateTime.of(2025, 1, 1, 12, 0, 0),
                lastUpdate = LocalDateTime.of(2025, 1, 1, 12, 0, 0)
            )
        )

        assertEquals(expected, result)
    }

    @Test
    fun `findByPatientId returns invoices ordered by creation desc`() {
        val result = repository.findByPatientId(PATIENT_ID)

        val expected = listOf(
            anInvoice(
                id = INVOICE_ID_2,
                operationId = OPERATION_ID,
                amount = aMoney(BigDecimal("150.50")),
                status = PAID,
                creationDateTime = LocalDateTime.of(2025, 1, 2, 9, 0, 0),
                lastUpdate = LocalDateTime.of(2025, 1, 2, 10, 0, 0)
            ),
            anInvoice(
                id = INVOICE_ID_1,
                operationId = OPERATION_ID,
                amount = aMoney(BigDecimal("100.00")),
                status = PENDING,
                creationDateTime = LocalDateTime.of(2025, 1, 1, 12, 0, 0),
                lastUpdate = LocalDateTime.of(2025, 1, 1, 12, 0, 0)
            )
        )

        assertEquals(expected, result)
    }

    @Test
    fun `save inserts when invoice not existing`() {
        val newInvoiceId = anInvoiceId("INV-003")
        val newInvoice = anInvoice(
            id = newInvoiceId,
            operationId = OPERATION_ID,
        )

        val saved = repository.save(newInvoice, PATIENT_ID)
        assertEquals(newInvoice, saved)

        val retrieved = repository.retrieve(newInvoiceId)
        assertEquals(newInvoice, retrieved)
    }

    @Test
    fun `save updates when invoice existing`() {
        val updated = anInvoice(
            id = INVOICE_ID_1,
            operationId = OPERATION_ID,
            amount = aMoney(BigDecimal("120.00"), "USD"),
            status = PAID,
            creationDateTime = LocalDateTime.of(2025, 1, 1, 12, 0, 0),
            lastUpdate = LocalDateTime.of(2025, 1, 4, 9, 0, 0)
        )

        val saved = repository.save(updated, PATIENT_ID)
        assertEquals(updated, saved)

        val retrieved = repository.retrieve(INVOICE_ID_1)
        assertEquals(updated, retrieved)
    }

    @Test
    fun `updateStatus updates status and lastUpdate`() {
        val result = repository.updateStatus(INVOICE_ID_1, PAID)

        val expected = anInvoice(
            id = INVOICE_ID_1,
            operationId = OPERATION_ID,
            amount = aMoney(BigDecimal("100.00")),
            status = PAID,
            creationDateTime = LocalDateTime.of(2025, 1, 1, 12, 0, 0),
            lastUpdate = FIXED_NOW
        )

        assertEquals(expected, result)
    }

    private fun runSql(resourcePath: String) {
        dataSource.connection.use { conn ->
            val input = this::class.java.getResourceAsStream(resourcePath)
                ?: throw IllegalStateException("Resource not found: $resourcePath")
            InputStreamReader(input, StandardCharsets.UTF_8).use { reader ->
                RunScript.execute(conn, reader)
            }
        }
    }

    private class FixedDateTimeProvider(private val fixedNow: LocalDateTime) : DateTimeProvider {
        override fun now(): LocalDateTime = fixedNow
    }

    companion object {
        private const val DB_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL"
        private const val SCHEMA_SQL = "/sql/schema.sql"
        private const val DATA_SQL = "/sql/data.sql"

        private val OPERATION_ID = anOperationId("OP-001")
        private val PATIENT_ID = aPatientId("PAT-001")
        private val INVOICE_ID_1 = anInvoiceId("INV-001")
        private val INVOICE_ID_2 = anInvoiceId("INV-002")
        private val FIXED_NOW: LocalDateTime = LocalDateTime.of(2025, 1, 5, 10, 0, 0)
    }
}
