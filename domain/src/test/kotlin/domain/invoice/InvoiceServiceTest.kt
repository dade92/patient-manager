package domain.invoice

import domain.exceptions.OperationNotFoundException
import domain.generator.InvoiceIdGenerator
import domain.model.InvoiceBuilder.aCreateInvoiceRequest
import domain.model.InvoiceBuilder.anInvoice
import domain.model.InvoiceBuilder.anInvoiceId
import domain.model.InvoiceId
import domain.model.InvoiceStatus.PAID
import domain.model.InvoiceStatus.PENDING
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.anOperationId
import domain.model.OperationType
import domain.model.PatientId
import domain.model.PatientOperation
import domain.operation.OperationRepository
import domain.utils.DateTimeProvider
import io.mockk.Called
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.LocalDateTime

class InvoiceServiceTest {

    private val invoiceRepository: InvoiceRepository = mockk(relaxed = true)
    private val operationRepository: OperationRepository = mockk()
    private val invoiceIdGenerator: InvoiceIdGenerator = mockk()
    private val dateTimeProvider: DateTimeProvider = mockk()

    private val service = InvoiceService(
        invoiceRepository = invoiceRepository,
        operationRepository = operationRepository,
        invoiceIdGenerator = invoiceIdGenerator,
        dateTimeProvider = dateTimeProvider
    )

    @Test
    fun `createInvoice creates a pending invoice with generated id and current time`() {
        val existingOperation = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = OperationType.SURGERY,
            description = "Appendectomy",
            executor = "Dr. Who",
            creationDateTime = NOW.minusDays(1),
            lastUpdate = NOW.minusHours(1),
            estimatedCost = AMOUNT
        )

        val request = aCreateInvoiceRequest(
            operationId = OPERATION_ID,
            patientId = PATIENT_ID,
            amount = AMOUNT
        )
        val invoice = anInvoice(
            id = INVOICE_ID,
            operationId = OPERATION_ID,
            amount = AMOUNT,
            status = PENDING,
            creationDateTime = NOW,
            lastUpdate = NOW
        )
        every { operationRepository.retrieve(OPERATION_ID) } returns existingOperation
        every { invoiceIdGenerator.generate() } returns INVOICE_ID
        every { dateTimeProvider.now() } returns NOW
        every { invoiceRepository.save(invoice, PATIENT_ID) } returns invoice

        val result = service.createInvoice(request)

        assertEquals(result, invoice)

        verify(exactly = 1) { operationRepository.retrieve(OPERATION_ID) }
        verify(exactly = 1) { invoiceIdGenerator.generate() }
        verify(exactly = 1) { dateTimeProvider.now() }
        verify(exactly = 1) { invoiceRepository.save(any(), PATIENT_ID) }
    }

    @Test
    fun `createInvoice throws when operation is not found`() {
        val request = aCreateInvoiceRequest(OPERATION_ID, PATIENT_ID, AMOUNT)

        every { operationRepository.retrieve(OPERATION_ID) } returns null

        assertThrows(OperationNotFoundException::class.java) {
            service.createInvoice(request)
        }

        verify(exactly = 1) { operationRepository.retrieve(OPERATION_ID) }
        verify { invoiceRepository wasNot Called }
    }

    @Test
    fun `getInvoice delegates to repository`() {
        val invoice = anInvoice(INVOICE_ID)

        every { invoiceRepository.retrieve(INVOICE_ID) } returns invoice

        val result = service.getInvoice(INVOICE_ID)

        assertEquals(invoice, result)
    }

    @Test
    fun `getInvoicesForOperation delegates to repository`() {
        val invoices = listOf(
            anInvoice(InvoiceId("INV-2")),
            anInvoice(InvoiceId("INV-3"))
        )

        every { invoiceRepository.findByOperationId(OPERATION_ID) } returns invoices

        val result = service.getInvoicesForOperation(OPERATION_ID)

        assertEquals(invoices, result)
    }

    @Test
    fun `getInvoicesForPatient delegates to repository`() {
        val invoices = listOf(anInvoice(INVOICE_ID))

        every { invoiceRepository.findByPatientId(PATIENT_ID) } returns invoices

        val result = service.getInvoicesForPatient(PATIENT_ID)

        assertEquals(invoices, result)
    }

    @Test
    fun `updateInvoiceStatus delegates to repository`() {
        val updated = anInvoice(INVOICE_ID)

        every { invoiceRepository.updateStatus(INVOICE_ID, PAID) } returns updated

        val result = service.updateInvoiceStatus(INVOICE_ID, PAID)

        assertEquals(updated, result)
    }

    companion object {
        private val OPERATION_ID = anOperationId()
        private val PATIENT_ID = PatientId("PAT-789")
        private val INVOICE_ID = anInvoiceId()
        private val AMOUNT = aMoney()
        private val NOW = LocalDateTime.of(2025, 1, 2, 3, 4, 5)
    }
}