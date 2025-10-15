package domain.patient

import domain.generator.PatientIdGenerator
import domain.model.PatientBuilder.aCreatePatientRequest
import domain.model.PatientBuilder.aPatient
import domain.model.PatientBuilder.aPatientId
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class PatientServiceTest {

    private val patientRepository: PatientRepository = mockk()
    private val patientIdGenerator: PatientIdGenerator = mockk()

    private val service = PatientService(
        patientRepository = patientRepository,
        patientIdGenerator = patientIdGenerator
    )

    @Test
    fun `createPatient creates patient with generated id and delegates to repository`() {
        val request = aCreatePatientRequest(
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH_DATE,
            taxCode = TAX_CODE
        )
        val expected = aPatient(
            id = PATIENT_ID,
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH_DATE,
            taxCode = TAX_CODE
        )

        every { patientIdGenerator.get() } returns PATIENT_ID
        every { patientRepository.save(expected) } returns expected

        val result = service.createPatient(request)

        assertEquals(expected, result)
    }

    @Test
    fun `retrievePatient delegates to repository`() {
        val patient = aPatient(id = PATIENT_ID)

        every { patientRepository.retrieve(PATIENT_ID) } returns patient

        val result = service.retrievePatient(PATIENT_ID)

        assertEquals(patient, result)
    }

    @Test
    fun `searchPatientsByName delegates to repository`() {
        val patients = listOf(
            aPatient(aPatientId()),
            aPatient(aPatientId())
        )

        every { patientRepository.searchByName(NAME) } returns patients

        val result = service.searchPatientsByName(NAME)

        assertEquals(patients, result)
    }

    companion object {
        private val PATIENT_ID = aPatientId("PAT-999")
        private const val NAME = "Jane Roe"
        private const val EMAIL = "jane.roe@example.com"
        private const val PHONE = "9876543210"
        private const val ADDRESS = "456 Side St"
        private const val CITY = "Metropolis"
        private const val NATIONALITY = "French"
        private val BIRTH_DATE = java.time.LocalDate.of(1985, 5, 20)
        private const val TAX_CODE = "TAX987"
    }
}