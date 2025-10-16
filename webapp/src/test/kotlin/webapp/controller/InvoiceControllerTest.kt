package webapp.controller

import domain.invoice.InvoiceService
import domain.model.InvoiceBuilder.aCreateInvoiceRequest
import domain.model.InvoiceBuilder.anInvoice
import domain.model.InvoiceBuilder.anInvoiceId
import domain.model.InvoiceStatus.PAID
import domain.model.InvoiceStatus.PENDING
import domain.model.Money.Companion.EUR
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.anOperationId
import domain.model.PatientBuilder.aPatientId
import domain.model.PatientId
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

class InvoiceControllerTest {

    private lateinit var mockMvc: MockMvc
    private val invoiceService = mockk<InvoiceService>()

    @BeforeEach
    fun setUp() {
        val controller = InvoiceController(invoiceService)
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }

    @Test
    fun `createInvoice returns 201 and delegates to service`() {
        val request = aCreateInvoiceRequest(
            operationId = anOperationId(OPERATION_ID),
            patientId = aPatientId(PATIENT_ID),
            amount = aMoney(AMOUNT, CURRENCY)
        )
        val created = anInvoice(
            id = anInvoiceId(INVOICE_ID),
            operationId = anOperationId(OPERATION_ID),
            amount = aMoney(AMOUNT, CURRENCY),
            status = PENDING,
            creationDateTime = java.time.LocalDateTime.of(2025, 1, 1, 12, 0, 0),
            lastUpdate = java.time.LocalDateTime.of(2025, 1, 1, 13, 0, 0)
        )

        every { invoiceService.createInvoice(any()) } returns created

        mockMvc.perform(
            post("/api/invoice")
                .contentType(MediaType.APPLICATION_JSON)
                .content(readFile("/fixtures/invoice/create-invoice.json"))
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/invoice/create-invoice-response.json")
                )
            )
    }

    @Test
    fun `getInvoice returns 200 with body when invoice exists`() {
        val invoice = anInvoice(
            id = anInvoiceId(INVOICE_ID),
            operationId = anOperationId(OPERATION_ID),
            amount = aMoney(AMOUNT, CURRENCY),
            status = PAID
        )

        every { invoiceService.getInvoice(anInvoiceId(INVOICE_ID)) } returns invoice

        mockMvc.perform(get("/api/invoice/$INVOICE_ID"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/invoice/get-invoice.json")
                )
            )
    }

    @Test
    fun `getInvoice returns 404 when not found`() {
        every { invoiceService.getInvoice(anInvoiceId("INV-404")) } returns null

        mockMvc.perform(get("/api/invoice/INV-404"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `getInvoicesForOperation returns list of invoices`() {
        val i1 = anInvoice(
            anInvoiceId("INV-1"),
            anOperationId(OPERATION_ID),
            aMoney(AMOUNT, CURRENCY),
            PENDING
        )
        val i2 = anInvoice(
            anInvoiceId("INV-2"),
            anOperationId(OPERATION_ID),
            aMoney(AMOUNT, CURRENCY),
            PAID
        )

        every { invoiceService.getInvoicesForOperation(anOperationId(OPERATION_ID)) } returns listOf(i1, i2)

        mockMvc.perform(get("/api/invoice/operation/$OPERATION_ID"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/invoice/get-invoices-per-operation.json")
                )
            )
    }

    @Test
    fun `getInvoicesForPatient returns list of invoices`() {
        val i1 = anInvoice(
            anInvoiceId("INV-1"),
            anOperationId(OPERATION_ID),
            aMoney(AMOUNT, CURRENCY),
            PENDING
        )
        val i2 = anInvoice(
            anInvoiceId("INV-2"),
            anOperationId(OPERATION_ID),
            aMoney(AMOUNT, CURRENCY),
            PAID
        )

        every { invoiceService.getInvoicesForPatient(PatientId(PATIENT_ID)) } returns listOf(i1, i2)

        mockMvc.perform(get("/api/invoice/patient/$PATIENT_ID"))
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/invoice/get-invoices-per-patient.json")
                )
            )
    }

    @Test
    fun `updateInvoiceStatus returns 200 when status updated`() {
        val updated = anInvoice(
            id = anInvoiceId(INVOICE_ID),
            operationId = anOperationId(OPERATION_ID),
            amount = aMoney(AMOUNT, CURRENCY),
            status = PAID
        )

        every { invoiceService.updateInvoiceStatus(anInvoiceId(INVOICE_ID), PAID) } returns updated

        mockMvc.perform(
            post("/api/invoice/$INVOICE_ID/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(readFile("/fixtures/invoice/update-invoice-status.json"))
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/invoice/update-invoice-status-response.json")
                )
            )
    }

    @Test
    fun `updateInvoiceStatus returns 404 when invoice not found`() {
        every { invoiceService.updateInvoiceStatus(anInvoiceId(INVOICE_ID), PAID) } returns null

        val requestJson = """{"status": "PAID"}"""

        mockMvc.perform(
            post("/api/invoice/$INVOICE_ID/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson)
        )
            .andExpect(status().isNotFound)
    }

    companion object {
        private const val INVOICE_ID = "INV-123"
        private const val OPERATION_ID = "OP-999"
        private const val PATIENT_ID = "PAT-111"
        private const val CURRENCY = EUR
        private val AMOUNT = 120.50.toBigDecimal()
    }
}
