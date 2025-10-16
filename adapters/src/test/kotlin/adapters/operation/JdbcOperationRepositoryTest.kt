package adapters.operation

import adapters.Utils.runSql
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.anOperationId
import domain.model.OperationBuilder.anOperationNote
import domain.model.OperationType
import domain.model.OperationType.SURGERY
import domain.model.PatientBuilder.aPatientId
import domain.utils.DateTimeProvider
import io.mockk.every
import io.mockk.mockk
import org.h2.jdbcx.JdbcDataSource
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.sql.DataSource

class JdbcOperationRepositoryTest {

    private lateinit var dataSource: DataSource
    private lateinit var repository: JdbcOperationRepository
    private val dateTimeProvider = mockk<DateTimeProvider>()

    @BeforeEach
    fun setUp() {
        dataSource = JdbcDataSource().apply { setUrl(DB_URL) }

        runSql(SCHEMA_SQL, dataSource)
        runSql(DATA_SQL, dataSource)

        repository = JdbcOperationRepository(dataSource, dateTimeProvider)

        every { dateTimeProvider.now() } returns NOW
    }

    @AfterEach
    fun tearDown() {
    }

    @Test
    fun `save inserts when operation not existing`() {
        val newOperationId = anOperationId("OP-002")
        val newOperation = aPatientOperation(
            id = newOperationId,
            patientId = PATIENT_ID,
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
            type = SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = ASSETS,
            additionalNotes = ADDITIONAL_NOTES,
            creationDateTime = OPERATION_CREATION_TIME,
            lastUpdate = OPERATION_LAST_UPDATE_TIME,
            estimatedCost = ESTIMATED_COST
        )

        val saved = repository.save(updated)
        assertEquals(updated, saved)

        val retrieved = repository.retrieve(OPERATION_ID)
        assertEquals(updated, retrieved)
    }

    @Test
    fun `retrieve returns operation when present`() {
        val result = repository.retrieve(OPERATION_ID)

        val expected = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = ASSETS,
            additionalNotes = ADDITIONAL_NOTES,
            creationDateTime = OPERATION_CREATION_TIME,
            lastUpdate = OPERATION_LAST_UPDATE_TIME,
            estimatedCost = ESTIMATED_COST
        )

        assertEquals(expected, result)
    }

    @Test
    fun `findByPatientId returns matches`() {
        val result = repository.findByPatientId(PATIENT_ID)

        assertEquals(
            listOf(
                aPatientOperation(
                    id = OPERATION_ID,
                    patientId = PATIENT_ID,
                    type = SURGERY,
                    description = DESCRIPTION,
                    executor = EXECUTOR,
                    assets = ASSETS,
                    additionalNotes = ADDITIONAL_NOTES,
                    creationDateTime = OPERATION_CREATION_TIME,
                    lastUpdate = OPERATION_LAST_UPDATE_TIME,
                    estimatedCost = ESTIMATED_COST
                )
            ),
            result
        )
    }

    @Test
    fun `addNote adds note and updates lastUpdate`() {
        val note = "note"
        val result = repository.addNote(OPERATION_ID, note)

        assertEquals(OPERATION_ID, result!!.id)
        assertEquals(NOW, result.lastUpdate)
        assertEquals(note, result.additionalNotes.first().content)
        assertEquals(NOW, result.additionalNotes.first().creationTime)
    }

    @Test
    fun `addAsset adds asset and updates lastUpdate`() {
        val newAssetName = "xray2.png"
        val result = repository.addAsset(OPERATION_ID, newAssetName)

        assertEquals(OPERATION_ID, result!!.id)
        assertEquals(NOW, result.lastUpdate)

        val assets = result.assets.toSet()
        assertTrue(assets.containsAll(setOf(OTHER_ASSET_NAME, newAssetName)))
    }

    companion object {
        private const val DB_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL"
        private const val SCHEMA_SQL = "/sql/schema.sql"
        private const val DATA_SQL = "/sql/data.sql"

        private const val OTHER_ASSET_NAME = "scan1.png"
        private val OPERATION_ID = anOperationId("OP-001")
        private val PATIENT_ID = aPatientId("PAT-001")
        private val NOW: LocalDateTime = LocalDateTime.of(2025, 1, 4, 8, 0, 0)
        private val ADDITIONAL_NOTE_CREATION_TIME = LocalDateTime.of(2025, 1, 1, 11, 0, 0)
        private val OPERATION_CREATION_TIME = LocalDateTime.of(2025, 1, 1, 10, 0, 0)
        private val OPERATION_LAST_UPDATE_TIME = LocalDateTime.of(2025, 1, 1, 10, 0, 0)
        private const val DESCRIPTION = "Appendectomy"
        private const val EXECUTOR = "Dr. Who"
        private val ASSETS = listOf("scan1.png")
        private val ADDITIONAL_NOTES = listOf(
            anOperationNote(
                content = "Initial assessment complete",
                creationTime = ADDITIONAL_NOTE_CREATION_TIME
            )
        )
        private val ESTIMATED_COST = aMoney(BigDecimal("2500.00"))
    }
}
