package adapters.invoice

import adapters.Utils.runSql
import domain.model.InvoiceBuilder.anInvoice
import domain.model.InvoiceBuilder.anInvoiceId
import domain.model.InvoiceStatus.PAID
import domain.model.InvoiceStatus.PENDING
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.anOperationId
import domain.model.PatientBuilder.aPatientId
import domain.utils.DateTimeProvider
import io.mockk.every
import io.mockk.mockk
import org.h2.jdbcx.JdbcDataSource
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.sql.DataSource

class JdbcInvoiceRepositoryTest {

    private lateinit var dataSource: DataSource
    private lateinit var repository: JdbcInvoiceRepository
    private val dateTimeProvider = mockk<DateTimeProvider>()

    @BeforeEach
    fun setUp() {
        dataSource = JdbcDataSource().apply { setUrl(DB_URL) }

        runSql(SCHEMA_SQL, dataSource)
        runSql(DATA_SQL, dataSource)

        repository = JdbcInvoiceRepository(dataSource, dateTimeProvider)

        every { dateTimeProvider.now() } returns NOW
    }
    
    @Test
    fun `retrieve returns invoice when present`() {
        val result = repository.retrieve(INVOICE_ID)

        val expected = anInvoice(
            id = INVOICE_ID,
            operationId = OPERATION_ID,
            amount = aMoney(BigDecimal("100.00")),
            status = PENDING,
            creationDateTime = FIRST_OF_JAN,
            lastUpdate = FIRST_OF_JAN
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
                creationDateTime = SECOND_OF_JAN,
                lastUpdate = SECOND_OF_JAN
            ),
            anInvoice(
                id = INVOICE_ID,
                operationId = OPERATION_ID,
                amount = aMoney(BigDecimal("100.00")),
                status = PENDING,
                creationDateTime = FIRST_OF_JAN,
                lastUpdate = FIRST_OF_JAN
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
                creationDateTime = SECOND_OF_JAN,
                lastUpdate = SECOND_OF_JAN
            ),
            anInvoice(
                id = INVOICE_ID,
                operationId = OPERATION_ID,
                amount = aMoney(BigDecimal("100.00")),
                status = PENDING,
                creationDateTime = FIRST_OF_JAN,
                lastUpdate = FIRST_OF_JAN
            )
        )

        assertEquals(expected, result)
    }

    @Test
    fun `save inserts when invoice not existing`() {
        val newInvoiceId = anInvoiceId("INV-003")
        val newInvoice = anInvoice(
            id = newInvoiceId,
        )

        val saved = repository.save(newInvoice, PATIENT_ID)
        assertEquals(newInvoice, saved)

        val retrieved = repository.retrieve(newInvoiceId)
        assertEquals(newInvoice, retrieved)
    }

    @Test
    fun `save updates when invoice existing`() {
        val updated = anInvoice(
            id = INVOICE_ID,
            operationId = OPERATION_ID,
            amount = aMoney(BigDecimal("120.00"), "USD"),
            status = PAID,
            creationDateTime = CREATION_DATE,
            lastUpdate = LAST_UPDATE
        )

        val saved = repository.save(updated, PATIENT_ID)
        assertEquals(updated, saved)

        val retrieved = repository.retrieve(INVOICE_ID)
        assertEquals(updated, retrieved)
    }

    @Test
    fun `updateStatus updates status and lastUpdate of the invoice`() {
        val result = repository.updateStatus(INVOICE_ID, PAID)

        val expected = anInvoice(
            id = INVOICE_ID,
            operationId = OPERATION_ID,
            amount = aMoney(BigDecimal("100.00")),
            status = PAID,
            creationDateTime = CREATION_DATE,
            lastUpdate = NOW
        )

        assertEquals(expected, result)
    }

    @Test
    fun `updateStatus returns null when invoice not found`() {
        val nonExistentInvoiceId = anInvoiceId("INV-666")

        assertNull(repository.updateStatus(nonExistentInvoiceId, PAID))
    }

    @Test
    fun `delete removes invoice when exists`() {
        repository.delete(INVOICE_ID)

        val retrieved = repository.retrieve(INVOICE_ID)
        assertNull(retrieved)
    }

    companion object {
        private const val DB_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL"
        private const val SCHEMA_SQL = "/sql/schema.sql"
        private const val DATA_SQL = "/sql/data.sql"

        private val OPERATION_ID = anOperationId("OP-001")
        private val PATIENT_ID = aPatientId("PAT-001")
        private val INVOICE_ID = anInvoiceId("INV-001")
        private val INVOICE_ID_2 = anInvoiceId("INV-002")
        private val NOW = LocalDateTime.of(2025, 1, 5, 10, 0, 0)
        private val FIRST_OF_JAN = LocalDateTime.of(2025, 1, 1, 12, 0, 0)
        private val SECOND_OF_JAN = LocalDateTime.of(2025, 1, 2, 9, 0, 0)
        private val CREATION_DATE = LocalDateTime.of(2025, 1, 1, 12, 0, 0)
        private val LAST_UPDATE = LocalDateTime.of(2025, 1, 4, 9, 0, 0)
    }
}
