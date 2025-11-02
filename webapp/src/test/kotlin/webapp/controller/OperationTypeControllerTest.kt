package webapp.controller

import domain.model.MoneyBuilder.aMoney
import domain.model.OperationTypeBuilder.anOperationType
import domain.model.PatientOperation.Type.Companion.CONSULTATION
import domain.model.PatientOperation.Type.Companion.SURGERY
import domain.operationtype.OperationTypeService
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
import utils.FixtureLoader.readFile
import webapp.adapter.OperationTypeResponseAdapter
import java.math.BigDecimal

class OperationTypeControllerTest {

    private lateinit var mockMvc: MockMvc
    private val operationTypeService = mockk<OperationTypeService>()
    private val operationTypeResponseAdapter = OperationTypeResponseAdapter()

    @BeforeEach
    fun setUp() {
        val controller = OperationTypeController(operationTypeService, operationTypeResponseAdapter)
        mockMvc = MockMvcBuilders
            .standaloneSetup(controller)
            .setControllerAdvice(GlobalExceptionHandler())
            .build()
    }

    @Test
    fun `createOperationType returns 201 and delegates to service`() {
        val operationType = anOperationType(
            type = SURGERY,
            description = "description",
            estimatedBaseCost = aMoney(BigDecimal("1500.00"))
        )

        every { operationTypeService.save(any()) } returns operationType

        mockMvc.perform(
            post("/api/operation-type")
                .contentType(MediaType.APPLICATION_JSON)
                .content(readFile("/fixtures/operation-type/createOperationTypeRequest.json"))
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/operation-type/createOperationTypeResponse.json")
                )
            )
    }

    @Test
    fun `getAllOperationTypes returns 200 with operation types list`() {
        val operationTypes = listOf(
            anOperationType(
                type = SURGERY,
                description = "description",
                estimatedBaseCost = aMoney(BigDecimal("1500.00"))
            ),
            anOperationType(
                type = CONSULTATION,
                description = "description 2",
                estimatedBaseCost = aMoney(BigDecimal("100.00"))
            )
        )

        every { operationTypeService.retrieve() } returns operationTypes

        mockMvc.perform(get("/api/operation-types"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/operation-type/getAll.json")
                )
            )
    }
}
