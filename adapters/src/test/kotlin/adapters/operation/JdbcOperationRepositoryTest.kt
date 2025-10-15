package adapters.operation

import domain.model.*
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.anOperationId
import domain.model.OperationBuilder.anOperationNote
import domain.model.PatientBuilder.aPatientId
import domain.utils.DateTimeProvider
import org.h2.jdbcx.JdbcDataSource
import org.h2.tools.RunScript
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.io.InputStreamReader
import java.math.BigDecimal
import java.nio.charset.StandardCharsets
import java.time.LocalDateTime
import javax.sql.DataSource

class JdbcOperationRepositoryTest {

    private lateinit var dataSource: DataSource
    private lateinit var repository: JdbcOperationRepository
    private val dateTimeProvider = FixedDateTimeProvider(FIXED_NOW)

    @BeforeEach
    fun setUp() {
        dataSource = JdbcDataSource().apply { setUrl(DB_URL) }

        runSql(SCHEMA_SQL)
        runSql(DATA_SQL)

        repository = JdbcOperationRepository(dataSource, dateTimeProvider)
    }

    @AfterEach
    fun tearDown() {
    }

    @Test
    fun `retrieve returns operation when present`() {
        val result = repository.retrieve(OPERATION_ID)

        val expected = aPatientOperation(
            id = OPERATION_ID,
            patientId = aPatientId("PAT-001"),
            type = OperationType.SURGERY,
            description = "Appendectomy",
            executor = "Dr. Who",
            assets = listOf("scan1.png"),
            additionalNotes = listOf(
                anOperationNote(
                    content = "Initial assessment complete",
                    creationTime = LocalDateTime.of(2025, 1, 1, 11, 0, 0)
                )
            ),
            creationDateTime = LocalDateTime.of(2025, 1, 1, 10, 0, 0),
            lastUpdate = LocalDateTime.of(2025, 1, 1, 10, 0, 0),
            estimatedCost = Money(BigDecimal("2500.00"))
        )

        assertEquals(expected, result)
    }

    @Test
    fun `findByPatientId returns matches`() {
        val result = repository.findByPatientId(PATIENT_ID)

        assertEquals(1, result.size)
        assertEquals(OPERATION_ID, result[0].id)
    }

    @Test
    fun `save inserts when operation not existing`() {
        val newOperationId = anOperationId("OP-002")
        val newOperation = aPatientOperation(
            id = newOperationId,
            patientId = PATIENT_ID,
            type = OperationType.CONSULTATION,
            description = "General check",
            executor = "Dr. House",
            assets = listOf("doc1.pdf", "doc2.pdf"),
            additionalNotes = listOf(anOperationNote("All good", LocalDateTime.of(2025, 1, 2, 12, 0, 0))),
            creationDateTime = LocalDateTime.of(2025, 1, 2, 12, 0, 0),
            lastUpdate = LocalDateTime.of(2025, 1, 2, 12, 0, 0),
            estimatedCost = Money(BigDecimal("150.00"))
        )

        val saved = repository.save(newOperation)
        assertEquals(newOperation, saved)

        val retrieved = repository.retrieve(newOperationId)
        assertEquals(newOperation, retrieved)
    }

    @Test
    fun `save updates when operation existing`() {
        val updated = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = OperationType.SURGERY,
            description = "Appendectomy - updated",
            executor = "Dr. Strange",
            assets = listOf("scan1.png", "scan2.png"),
            additionalNotes = listOf(
                anOperationNote(
                    "Initial assessment complete",
                    LocalDateTime.of(2025, 1, 1, 11, 0, 0)
                )
            ),
            creationDateTime = LocalDateTime.of(2025, 1, 1, 10, 0, 0),
            lastUpdate = LocalDateTime.of(2025, 1, 3, 9, 0, 0),
            estimatedCost = Money(BigDecimal("2500.00"))
        )

        val saved = repository.save(updated)
        assertEquals(updated, saved)

        val retrieved = repository.retrieve(OPERATION_ID)
        assertEquals(updated, retrieved)
    }

    @Test
    fun `addNote adds note and updates lastUpdate`() {
        val note = "note"
        val result = repository.addNote(OPERATION_ID, note)

        assertEquals(OPERATION_ID, result!!.id)
        assertEquals(FIXED_NOW, result.lastUpdate)
        assertEquals(note, result.additionalNotes.first().content)
        assertEquals(FIXED_NOW, result.additionalNotes.first().creationTime)
    }

    @Test
    fun `addAsset adds asset and updates lastUpdate`() {
        val newAssetName = "xray2.png"
        val result = repository.addAsset(OPERATION_ID, newAssetName)

        assertEquals(OPERATION_ID, result!!.id)
        assertEquals(FIXED_NOW, result.lastUpdate)

        val assets = result.assets.toSet()
        assertTrue(assets.containsAll(setOf("scan1.png", newAssetName)))
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

        private val OPERATION_ID = OperationId("OP-001")
        private val PATIENT_ID = PatientId("PAT-001")
        private val FIXED_NOW: LocalDateTime = LocalDateTime.of(2025, 1, 4, 8, 0, 0)
    }
}
