package webapp.controller

import domain.exceptions.PatientNotFoundException
import domain.model.Money.Companion.EUR
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.anOperationId
import domain.model.OperationBuilder.anOperationNote
import domain.model.OperationType
import domain.model.PatientBuilder.aPatientId
import domain.operation.CreateOperationRequest
import domain.operation.OperationService
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.mock.web.MockMultipartFile
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import utils.FixtureLoader.readFile
import java.math.BigDecimal
import java.time.LocalDateTime

class OperationControllerTest {

    private lateinit var mockMvc: MockMvc
    private val operationService = mockk<OperationService>()

    @BeforeEach
    fun setUp() {
        val controller = OperationController(operationService)
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }

    @Test
    fun `getOperation returns 200 with body when operation exists`() {
        val operation = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = OperationType.SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = listOf(ORIGINAL_FILENAME_1),
            additionalNotes = listOf(anOperationNote(NOTE, NOTE_TIME)),
            creationDateTime = CREATED_AT,
            lastUpdate = UPDATED_AT,
            estimatedCost = aMoney(AMOUNT, EUR)
        )

        every { operationService.getOperation(OPERATION_ID) } returns operation

        mockMvc.perform(get("/api/operation/OP-123"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/operation/get-operation.json")
                )
            )
    }

    @Test
    fun `getOperation returns 404 when not found`() {
        every { operationService.getOperation(OPERATION_ID) } returns null

        mockMvc.perform(get("/api/operation/OP-123"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `getPatientOperations returns 200 with the list of operations`() {
        val operation = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = OperationType.SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = listOf(ORIGINAL_FILENAME_1),
            additionalNotes = listOf(anOperationNote(NOTE, NOTE_TIME)),
            creationDateTime = CREATED_AT,
            lastUpdate = UPDATED_AT,
            estimatedCost = aMoney(AMOUNT, EUR)
        )

        every { operationService.retrieveOperationsBy(PATIENT_ID) } returns listOf(operation)

        mockMvc.perform(get("/api/operation/patient/PAT-123"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/operation/search-operations.json")
                )
            )
    }

    @Test
    fun `getPatientOperations returns 404 when patient not found`() {
        every { operationService.retrieveOperationsBy(PATIENT_ID) } throws PatientNotFoundException(PATIENT_ID)

        mockMvc.perform(get("/api/operation/patient/PAT-123"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `createOperation returns 201 and delegates to service`() {
        val expectedRequest = CreateOperationRequest(
            patientId = PATIENT_ID,
            type = OperationType.SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            estimatedCost = aMoney(AMOUNT, EUR)
        )
        val created = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = OperationType.SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = emptyList(),
            additionalNotes = emptyList(),
            creationDateTime = CREATED_AT,
            lastUpdate = UPDATED_AT,
            estimatedCost = aMoney(AMOUNT, EUR)
        )

        every { operationService.createOperation(expectedRequest) } returns created

        mockMvc.perform(
            post("/api/operation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(readFile("/fixtures/operation/create-operation.json"))
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/operation/create-operation-response.json")
                )
            )
    }

    @Test
    fun `addOperationNote returns 200 with updated operation`() {
        val updated = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = OperationType.SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = listOf(ORIGINAL_FILENAME_1),
            additionalNotes = listOf(anOperationNote(NOTE, NOTE_TIME)),
            creationDateTime = CREATED_AT,
            lastUpdate = UPDATED_AT,
            estimatedCost = aMoney(AMOUNT, EUR)
        )

        every { operationService.addOperationNote(OPERATION_ID, NOTE) } returns updated

        mockMvc.perform(
            post("/api/operation/OP-123/notes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"content":"$NOTE"}""")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/operation/add-note-response.json")
                )
            )
    }

    @Test
    fun `addOperationAsset returns 200 with updated operation`() {
        val updated = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = OperationType.SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = listOf(ORIGINAL_FILENAME_1, ORIGINAL_FILENAME_2),
            additionalNotes = listOf(anOperationNote(NOTE, NOTE_TIME)),
            creationDateTime = CREATED_AT,
            lastUpdate = UPDATED_AT,
            estimatedCost = aMoney(AMOUNT, EUR)
        )

        val file = MockMultipartFile(
            "file",
            ORIGINAL_FILENAME_2,
            "image/png",
            FILE_CONTENT
        )

        every {
            operationService.addOperationAsset(
                OPERATION_ID,
                ORIGINAL_FILENAME_2,
                3,
                "image/png",
                any()
            )
        } returns updated

        mockMvc.perform(
            multipart("/api/operation/OP-123/assets").file(file)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/operation/add-asset-response.json")
                )
            )
    }

    companion object {
        private val OPERATION_ID = anOperationId("OP-123")
        private val PATIENT_ID = aPatientId("PAT-123")
        private const val DESCRIPTION = "Appendectomy"
        private const val EXECUTOR = "Dr. Who"
        private const val ORIGINAL_FILENAME_1 = "scan1.png"
        private const val NOTE = "Initial assessment complete"
        private const val ORIGINAL_FILENAME_2 = "xray2.png"
        private val NOTE_TIME = LocalDateTime.of(2025, 1, 1, 11, 0, 0)
        private val CREATED_AT = LocalDateTime.of(2025, 1, 1, 10, 0, 0)
        private val UPDATED_AT = LocalDateTime.of(2025, 1, 2, 9, 0, 0)
        private val AMOUNT = BigDecimal("2500.00")
        private val FILE_CONTENT = byteArrayOf(1, 2, 3)
    }
}
