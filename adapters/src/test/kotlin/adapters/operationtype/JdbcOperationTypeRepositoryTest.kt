package adapters.operationtype

import adapters.Utils.runSql
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationTypeBuilder.anOperationType
import domain.model.PatientOperation
import domain.model.PatientOperation.Type.Companion.CONSULTATION
import domain.model.PatientOperation.Type.Companion.SURGERY
import org.h2.jdbcx.JdbcDataSource
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import javax.sql.DataSource

class JdbcOperationTypeRepositoryTest {

    private lateinit var dataSource: DataSource
    private lateinit var repository: JdbcOperationTypeRepository

    @BeforeEach
    fun setUp() {
        dataSource = JdbcDataSource().apply {
            setUrl(DB_URL)
        }

        runSql(SCHEMA_SQL, dataSource)
        runSql(DATA_SQL, dataSource)

        repository = JdbcOperationTypeRepository(dataSource)
    }

    @AfterEach
    fun tearDown() {
    }

    @Test
    fun `save inserts new operation type when not existing`() {
        val operationType = anOperationType(
            type = PatientOperation.Type("FOLLOW_UP"),
            description = "Follow-up appointment",
            estimatedBaseCost = aMoney(BigDecimal("75.00"), "EUR")
        )

        val result = repository.save(operationType)

        assertEquals(operationType, result)

        val retrieved = repository.retrieveAll()
        assertEquals(5, retrieved.size)

        val followUp = retrieved.find { it.type.type == "FOLLOW_UP" }
        assertEquals(operationType, followUp)
    }

    @Test
    fun `save updates existing operation type when already exists`() {
        val updatedOperationType = anOperationType(
            type = CONSULTATION,
            description = "Extended consultation",
            estimatedBaseCost = aMoney(BigDecimal("150.00"), "EUR")
        )

        val result = repository.save(updatedOperationType)

        assertEquals(updatedOperationType, result)

        val retrieved = repository.retrieveAll()
        assertEquals(4, retrieved.size)

        val consultation = retrieved.find { it.type.type == "CONSULTATION" }
        assertEquals(updatedOperationType, consultation)
    }

    @Test
    fun `retrieveAll returns all operation types ordered by type`() {
        val result = repository.retrieveAll()

        assertEquals(4, result.size)

        val consultation = anOperationType(
            type = CONSULTATION,
            description = "Standard consultation",
            estimatedBaseCost = aMoney(BigDecimal("100.00"), "EUR")
        )
        val diagnostic = anOperationType(
            type = PatientOperation.Type("DIAGNOSTIC"),
            description = "Diagnostic examination",
            estimatedBaseCost = aMoney(BigDecimal("250.00"), "EUR")
        )
        val surgery = anOperationType(
            type = SURGERY,
            description = "Complex surgical procedure",
            estimatedBaseCost = aMoney(BigDecimal("1500.00"), "EUR")
        )
        val treatment = anOperationType(
            type = PatientOperation.Type("TREATMENT"),
            description = "Medical treatment",
            estimatedBaseCost = aMoney(BigDecimal("300.00"), "EUR")
        )

        assertEquals(consultation, result[0]) // CONSULTATION
        assertEquals(diagnostic, result[1])   // DIAGNOSTIC
        assertEquals(surgery, result[2])      // SURGERY
        assertEquals(treatment, result[3])    // TREATMENT
    }

    companion object {
        private const val DB_URL = "jdbc:h2:mem:test;MODE=MySQL;DB_CLOSE_DELAY=-1"
        private const val SCHEMA_SQL = "/sql/schema.sql"
        private const val DATA_SQL = "/sql/data.sql"
    }
}
