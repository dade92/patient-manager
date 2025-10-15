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
            setUrl("jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL")
        }

        runSql("/sql/schema.sql")
        runSql("/sql/data.sql")

        repository = JdbcPatientRepository(dataSource)
    }

    @AfterEach
    fun tearDown() {}

    @Test
    fun `retrieve returns patient when present`() {
        val result = repository.retrieve(PatientId("PAT-001"))

        val expected = aPatient(
            id = PatientId("PAT-001"),
            name = "John Doe",
            email = "john.doe@example.com",
            phoneNumber = "1234567890",
            address = "123 Main St",
            cityOfResidence = "Springfield",
            nationality = "Italian",
            birthDate = LocalDate.of(1990, 1, 1),
            taxCode = "TAXCODE123"
        )

        assertEquals(expected, result)
    }

    @Test
    fun `searchByName returns matches`() {
        val result = repository.searchByName("Jo")

        assertEquals(1, result.size)
        assertEquals("PAT-001", result[0].id.value)
    }

    @Test
    fun `save inserts when patient not existing`() {
        val newPatient = aPatient(
            id = PatientId("PAT-003"),
            name = "Alice Smith",
            email = "alice@example.com",
            phoneNumber = null,
            address = null,
            cityOfResidence = "Gotham",
            nationality = "German",
            birthDate = LocalDate.of(1992, 7, 15),
            taxCode = "TAX-ALICE"
        )

        val saved = repository.save(newPatient)
        assertEquals(newPatient, saved)

        val retrieved = repository.retrieve(PatientId("PAT-003"))
        assertEquals(newPatient, retrieved)
    }

    @Test
    fun `save updates when patient existing`() {
        val updatedPatient = aPatient(
            id = PatientId("PAT-002"),
            name = "Jane Roe Updated",
            email = "jane.roe.updated@example.com",
            phoneNumber = "555-1212",
            address = "789 New Ave",
            cityOfResidence = "Star City",
            nationality = "Spanish",
            birthDate = LocalDate.of(1986, 6, 21),
            taxCode = "TAX987-UPDATED"
        )

        val saved = repository.save(updatedPatient)
        assertEquals(updatedPatient, saved)

        val retrieved = repository.retrieve(PatientId("PAT-002"))
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
}
