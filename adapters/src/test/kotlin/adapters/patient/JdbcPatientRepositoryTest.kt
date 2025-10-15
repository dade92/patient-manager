package adapters.patient

import domain.model.PatientBuilder.aPatient
import domain.model.PatientId
import org.h2.jdbcx.JdbcDataSource
import org.h2.tools.RunScript
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets
import java.time.LocalDate
import javax.sql.DataSource

class JdbcPatientRepositoryTest {

    private lateinit var dataSource: DataSource
    private lateinit var repository: JdbcPatientRepository

    @BeforeEach
    fun setUp() {
        dataSource = JdbcDataSource().apply {
            setUrl(DB_URL)
        }

        runSql(SCHEMA_SQL)
        runSql(DATA_SQL)

        repository = JdbcPatientRepository(dataSource)
    }

    @AfterEach
    fun tearDown() {}

    @Test
    fun `retrieve returns patient when present`() {
        val result = repository.retrieve(PatientId(ID))

        val expected = aPatient(
            id = PatientId(ID),
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH,
            taxCode = TAX
        )

        assertEquals(expected, result)
    }

    @Test
    fun `searchByName returns matches`() {
        val result = repository.searchByName("Jo")

        assertEquals(1, result.size)
        assertEquals(ID, result[0].id.value)
    }

    @Test
    fun `save inserts when patient not existing`() {
        val newPatient = aPatient(
            id = PatientId(ID),
            name = NAME,
            email = EMAIL,
            phoneNumber = null,
            address = null,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH,
            taxCode = TAX
        )

        val saved = repository.save(newPatient)
        assertEquals(newPatient, saved)

        val retrieved = repository.retrieve(PatientId(ID))
        assertEquals(newPatient, retrieved)
    }

    @Test
    fun `save updates when patient existing`() {
        val updatedPatient = aPatient(
            id = PatientId(ID),
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH,
            taxCode = TAX
        )

        val saved = repository.save(updatedPatient)
        assertEquals(updatedPatient, saved)

        val retrieved = repository.retrieve(PatientId(ID))
        assertEquals(updatedPatient, retrieved)
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

    companion object {
        private const val DB_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL"
        private const val SCHEMA_SQL = "/sql/schema.sql"
        private const val DATA_SQL = "/sql/data.sql"

        private const val ID = "PAT-001"
        private const val NAME = "John Doe"
        private const val EMAIL = "john.doe@example.com"
        private const val PHONE = "1234567890"
        private const val ADDRESS = "123 Main St"
        private const val CITY = "Springfield"
        private const val NATIONALITY = "Italian"
        private val BIRTH: LocalDate = LocalDate.of(1990, 1, 1)
        private const val TAX = "TAXCODE123"
    }
}
