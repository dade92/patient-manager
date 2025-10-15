package webapp.controller

import domain.model.PatientBuilder.aPatient
import domain.model.PatientBuilder.aPatientId
import domain.patient.CreatePatientRequest
import domain.patient.PatientService
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import utils.FixtureLoader
import java.time.LocalDate

class PatientControllerTest {

    private lateinit var mockMvc: MockMvc
    private val patientService = mockk<PatientService>()

    @BeforeEach
    fun setUp() {
        val controller = PatientController(patientService)
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }

    @Test
    fun `getPatient returns 200 with body when patient exists`() {
        val patient = aPatient(id = PATIENT_ID)

        every { patientService.retrievePatient(PATIENT_ID) } returns patient

        mockMvc.perform(get("/api/patient/${PATIENT_ID.value}"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    FixtureLoader.readFile("/fixtures/patient/get-patient.json")
                )
            )
    }

    @Test
    fun `getPatient returns 404 when not found`() {
        val id = "PAT-404"
        every { patientService.retrievePatient(aPatientId(id)) } returns null

        mockMvc.perform(get("/api/patient/$id"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `searchPatients returns list wrapped in response`() {
        val p1 = aPatient(PATIENT_ID)
        val p2 = aPatient(aPatientId("PAT-2"))
        every { patientService.searchPatientsByName(NAME_QUERY) } returns listOf(p1, p2)

        mockMvc.perform(get("/api/patient/search").param("name", NAME_QUERY))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    FixtureLoader.readFile("/fixtures/patient/search-patients.json")
                )
            )
    }

    @Test
    fun `createPatient returns 201 and delegates to service`() {
        val requestJson = FixtureLoader.readFile("/fixtures/patient/create-patient.json")

        val expectedRequest = CreatePatientRequest(
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
            aPatient(aPatientId("PAT-999"), NAME, EMAIL, PHONE, ADDRESS, CITY, NATIONALITY, BIRTH_DATE, TAX_CODE)

        every { patientService.createPatient(expectedRequest) } returns created

        mockMvc.perform(
            post("/api/patient")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson)
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    FixtureLoader.readFile("/fixtures/patient/create-patient-response.json")
                )
            )
    }

    companion object {
        private const val NAME_QUERY = "Jo"

        private val PATIENT_ID = aPatientId("PAT-123")
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
