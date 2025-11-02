package adapters.operationtype

import adapters.Utils.runSql
import domain.exceptions.OperationTypeAlreadyExistsException
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationTypeBuilder.anOperationType
import domain.model.PatientOperation
import domain.model.PatientOperation.Type.Companion.CONSULTATION
import domain.model.PatientOperation.Type.Companion.DIAGNOSTIC
import domain.model.PatientOperation.Type.Companion.SURGERY
import domain.model.PatientOperation.Type.Companion.TREATMENT
import org.h2.jdbcx.JdbcDataSource
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
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

    @Test
    fun `save inserts new operation type when not existing`() {
        val operationType = anOperationType(
            type = PatientOperation.Type(TYPE),
            description = DESCRIPTION,
            estimatedBaseCost = ESTIMATED_BASE_COST
        )

        val result = repository.save(operationType)

        assertEquals(operationType, result)

        val retrieved = repository.retrieveAll()
        assertEquals(5, retrieved.size)

        val inserted = retrieved.find { it.type.type == TYPE }
        assertEquals(operationType, inserted)
    }

    @Test
    fun `save throws exception when operation type already exists`() {
        val duplicateOperationType = anOperationType(
            type = CONSULTATION,
            description = "Extended consultation",
            estimatedBaseCost = aMoney(BigDecimal("150.00"), "EUR")
        )

        val exception = assertThrows(OperationTypeAlreadyExistsException::class.java) {
            repository.save(duplicateOperationType)
        }

        assertEquals(CONSULTATION, exception.operationType)
        assertEquals("Operation type already exists: CONSULTATION", exception.message)
    }

    @Test
    fun `retrieveAll returns all operation types alphabetically ordered by type`() {
        val result = repository.retrieveAll()

        assertEquals(4, result.size)

        val consultation = anOperationType(
            type = CONSULTATION,
            description = "Standard consultation",
            estimatedBaseCost = aMoney(BigDecimal("100.00"), "EUR")
        )
        val diagnostic = anOperationType(
            type = DIAGNOSTIC,
            description = "Diagnostic examination",
            estimatedBaseCost = aMoney(BigDecimal("250.00"), "EUR")
        )
        val surgery = anOperationType(
            type = SURGERY,
            description = "Complex surgical procedure",
            estimatedBaseCost = aMoney(BigDecimal("1500.00"), "EUR")
        )
        val treatment = anOperationType(
            type = TREATMENT,
            description = "Medical treatment",
            estimatedBaseCost = aMoney(BigDecimal("300.00"), "EUR")
        )

        assertEquals(consultation, result[0])
        assertEquals(diagnostic, result[1])
        assertEquals(surgery, result[2])
        assertEquals(treatment, result[3])
    }

    companion object {
        private const val DB_URL = "jdbc:h2:mem:test;MODE=MySQL;DB_CLOSE_DELAY=-1"
        private const val SCHEMA_SQL = "/sql/schema.sql"
        private const val DATA_SQL = "/sql/data.sql"
        private const val TYPE = "FOLLOW_UP"
        private const val DESCRIPTION = "Follow-up appointment"
        private val ESTIMATED_BASE_COST = aMoney(BigDecimal("75.00"), "EUR")
    }
}
