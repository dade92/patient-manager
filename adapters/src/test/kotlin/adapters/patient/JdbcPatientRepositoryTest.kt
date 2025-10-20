package adapters.patient

import adapters.Utils.runSql
import domain.model.PatientBuilder.aPatient
import domain.model.PatientBuilder.aPatientId
import org.h2.jdbcx.JdbcDataSource
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
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

        runSql(SCHEMA_SQL, dataSource)
        runSql(DATA_SQL, dataSource)

        repository = JdbcPatientRepository(dataSource)
    }

    @AfterEach
    fun tearDown() {
    }

    @Test
    fun `retrieve returns patient when present`() {
        val result = repository.retrieve(PATIENT_ID)

        val expected = aPatient(
            id = PATIENT_ID,
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH,
            taxCode = TAX,
            medicalHistory = MEDICAL_HISTORY
        )

        assertEquals(expected, result)
    }

    @Test
    fun `retrieve returns null when not present`() {
        val nonExistentPatientId = aPatientId("PAT-666")

        assertNull(repository.retrieve(nonExistentPatientId))
    }

    @Test
    fun `searchByName returns matches`() {
        val result = repository.searchByName("Jo")

        assertEquals(1, result.size)

        val expected = aPatient(
            id = PATIENT_ID,
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH,
            taxCode = TAX,
            medicalHistory = MEDICAL_HISTORY
        )

        assertEquals(listOf(expected), result)
    }

    @Test
    fun `save inserts when patient not existing`() {
        val newPatient = aPatient(
            id = PATIENT_ID,
            name = NAME,
            email = EMAIL,
            phoneNumber = null,
            address = null,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH,
            taxCode = TAX,
            medicalHistory = MEDICAL_HISTORY
        )

        val saved = repository.save(newPatient)
        assertEquals(newPatient, saved)

        val retrieved = repository.retrieve(PATIENT_ID)
        assertEquals(newPatient, retrieved)
    }

    @Test
    fun `save updates when patient existing`() {
        val updatedPatient = aPatient(
            id = PATIENT_ID,
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH,
            taxCode = TAX,
            medicalHistory = MEDICAL_HISTORY
        )

        val saved = repository.save(updatedPatient)
        assertEquals(updatedPatient, saved)

        val retrieved = repository.retrieve(PATIENT_ID)
        assertEquals(updatedPatient, retrieved)
    }

    companion object {
        private const val DB_URL = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL"
        private const val SCHEMA_SQL = "/sql/schema.sql"
        private const val DATA_SQL = "/sql/data.sql"

        private val PATIENT_ID = aPatientId("PAT-001")
        private const val NAME = "John Doe"
        private const val EMAIL = "john.doe@example.com"
        private const val PHONE = "1234567890"
        private const val ADDRESS = "123 Main St"
        private const val CITY = "Springfield"
        private const val NATIONALITY = "Italian"
        private val BIRTH: LocalDate = LocalDate.of(1990, 1, 1)
        private const val TAX = "TAXCODE123"
        private const val MEDICAL_HISTORY = "medical history"
    }
}
