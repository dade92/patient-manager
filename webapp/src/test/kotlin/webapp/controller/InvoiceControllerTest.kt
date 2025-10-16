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
import java.time.LocalDateTime

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
            operationId = OPERATION_ID,
            patientId = PATIENT_ID,
            amount = aMoney(AMOUNT, EUR)
        )
        val created = anInvoice(
            id = INVOICE_ID,
            operationId = OPERATION_ID,
            amount = aMoney(AMOUNT, EUR),
            status = PENDING,
            creationDateTime = CREATION_DATE_TIME,
            lastUpdate = CREATION_DATE_TIME
        )

        every { invoiceService.createInvoice(request) } returns created

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
            id = INVOICE_ID,
            operationId = OPERATION_ID,
            amount = aMoney(AMOUNT, EUR),
            status = PAID
        )

        every { invoiceService.getInvoice(INVOICE_ID) } returns invoice

        mockMvc.perform(get("/api/invoice/INV-123"))
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
            OPERATION_ID,
            aMoney(AMOUNT, EUR),
            PENDING
        )
        val i2 = anInvoice(
            anInvoiceId("INV-2"),
            OPERATION_ID,
            aMoney(AMOUNT, EUR),
            PAID
        )

        every { invoiceService.getInvoicesForOperation(OPERATION_ID) } returns listOf(i1, i2)

        mockMvc.perform(get("/api/invoice/operation/OP-999"))
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
            OPERATION_ID,
            aMoney(AMOUNT, EUR),
            PENDING
        )
        val i2 = anInvoice(
            anInvoiceId("INV-2"),
            OPERATION_ID,
            aMoney(AMOUNT, EUR),
            PAID
        )

        every { invoiceService.getInvoicesForPatient(aPatientId("PAT-111")) } returns listOf(i1, i2)

        mockMvc.perform(get("/api/invoice/patient/PAT-111"))
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
            id = INVOICE_ID,
            operationId = OPERATION_ID,
            amount = aMoney(AMOUNT, EUR),
            status = PAID
        )

        every { invoiceService.updateInvoiceStatus(INVOICE_ID, PAID) } returns updated

        mockMvc.perform(
            post("/api/invoice/INV-123/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(readFile("/fixtures/invoice/update-invoice-status.json"))
        ).andExpect(status().isOk)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(
                content().json(
                    readFile("/fixtures/invoice/update-invoice-status-response.json")
                )
            )
    }

    @Test
    fun `updateInvoiceStatus returns 404 when invoice not found`() {
        every { invoiceService.updateInvoiceStatus(INVOICE_ID, PAID) } returns null

        mockMvc.perform(
            post("/api/invoice/INV-123/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"status": "PAID"}""")
        ).andExpect(status().isNotFound)
    }

    companion object {
        private val INVOICE_ID = anInvoiceId("INV-123")
        private val OPERATION_ID = anOperationId("OP-999")
        private val PATIENT_ID = aPatientId("PAT-111")
        private val AMOUNT = 120.50.toBigDecimal()
        private val CREATION_DATE_TIME = LocalDateTime.of(2025, 1, 1, 12, 0, 0)
    }
}
