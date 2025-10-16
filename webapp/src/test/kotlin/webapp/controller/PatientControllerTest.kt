package webapp.controller

import domain.model.PatientBuilder.aCreatePatientRequest
import domain.model.PatientBuilder.aPatient
import domain.model.PatientBuilder.aPatientId
import domain.patient.PatientService
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import utils.FixtureLoader
import utils.FixtureLoader.readFile
import java.time.LocalDate

class PatientControllerTest {

    private lateinit var mockMvc: MockMvc
    private val patientService = mockk<PatientService>()

    @BeforeEach
    fun setUp() {
        val controller = PatientController(patientService)
        mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .setControllerAdvice(GlobalExceptionHandler())
            .build()
    }

    @Test
    fun `getPatient returns 200 with body when patient exists`() {
        val patient = aPatient(
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

        every { patientService.retrievePatient(PATIENT_ID) } returns patient

        mockMvc.perform(get("/api/patient/PAT-123"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/patient/get-patient.json")
                )
            )
    }

    @Test
    fun `getPatient returns 404 when not found`() {
        every { patientService.retrievePatient(PATIENT_ID) } returns null

        mockMvc.perform(get("/api/patient/PAT-123"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `searchPatients returns list wrapped in response`() {
        val p1 = aPatient(
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
        val p2 = aPatient(
            id = ANOTHER_PATIENT_ID,
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH_DATE,
            taxCode = TAX_CODE
        )
        every { patientService.searchPatientsByName(NAME_QUERY) } returns listOf(p1, p2)

        mockMvc.perform(get("/api/patient/search").param("name", NAME_QUERY))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/patient/search-patients.json")
                )
            )
    }

    @Test
    fun `createPatient returns 201 and delegates to service`() {
        val expectedRequest = aCreatePatientRequest(
            name = NAME,
            email = EMAIL,
            phoneNumber = PHONE,
            address = ADDRESS,
            cityOfResidence = CITY,
            nationality = NATIONALITY,
            birthDate = BIRTH_DATE,
            taxCode = TAX_CODE
        )
        val created =
            aPatient(
                PATIENT_ID,
                NAME,
                EMAIL,
                PHONE,
                ADDRESS,
                CITY,
                NATIONALITY,
                BIRTH_DATE,
                TAX_CODE
            )

        every { patientService.createPatient(expectedRequest) } returns created

        mockMvc.perform(
            post("/api/patient")
                .contentType(MediaType.APPLICATION_JSON)
                .content(readFile("/fixtures/patient/create-patient.json"))
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/patient/create-patient-response.json")
                )
            )
    }

    @Test
    fun `createPatient returns 500 when service throws an exception`() {
        val expectedException = RuntimeException("Database connection failed")

        every { patientService.createPatient(any()) } throws expectedException

        mockMvc.perform(
            post("/api/patient")
                .contentType(MediaType.APPLICATION_JSON)
                .content(readFile("/fixtures/patient/create-patient.json"))
        ).andExpect(status().isInternalServerError)
    }

    companion object {
        private const val NAME_QUERY = "Jo"

        private val PATIENT_ID = aPatientId("PAT-123")
        private val ANOTHER_PATIENT_ID = aPatientId("PAT-456")
        private const val NAME = "John Doe"
        private const val EMAIL = "john.doe@example.com"
        private const val PHONE = "1234567890"
        private const val ADDRESS = "123 Main St"
        private const val CITY = "Springfield"
        private const val NATIONALITY = "Italian"
        private val BIRTH_DATE: LocalDate = LocalDate.of(1990, 1, 1)
        private const val TAX_CODE = "TAXCODE123"
    }
}
