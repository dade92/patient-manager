package domain.invoice

import domain.exceptions.OperationNotFoundException
import domain.generator.InvoiceIdGenerator
import domain.model.*
import domain.model.InvoiceStatus.PENDING
import domain.operation.OperationRepository
import domain.utils.DateTimeProvider
import io.mockk.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.math.BigDecimal
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
        val amount = Money(BigDecimal("123.45"), Money.EUR)

        val existingOperation = PatientOperation(
            id = operationId,
            patientId = patientId,
            type = OperationType.SURGERY,
            description = "Appendectomy",
            executor = "Dr. Who",
            creationDateTime = NOW.minusDays(1),
            lastUpdate = NOW.minusHours(1),
            estimatedCost = amount
        )

        val request = CreateInvoiceRequest(
            operationId = operationId,
            patientId = patientId,
            amount = amount
        )
        val invoice = Invoice(
            id = invoiceId,
            operationId = operationId,
            amount = amount,
            status = PENDING,
            creationDateTime = NOW,
            lastUpdate = NOW
        )
        every { operationRepository.retrieve(operationId) } returns existingOperation
        every { invoiceIdGenerator.generate() } returns invoiceId
        every { dateTimeProvider.now() } returns NOW
        every { invoiceRepository.save(invoice, patientId) } returns invoice

        val result = service.createInvoice(request)

        assertEquals(result, invoice)

        verify(exactly = 1) { operationRepository.retrieve(operationId) }
        verify(exactly = 1) { invoiceIdGenerator.generate() }
        verify(exactly = 1) { dateTimeProvider.now() }
        verify(exactly = 1) { invoiceRepository.save(any(), patientId) }
    }

    @Test
    fun `createInvoice throws when operation is not found`() {
        val operationId = OperationId("OP-404")
        val patientId = PatientId("PAT-1")
        val amount = Money(BigDecimal.TEN)
        val request = CreateInvoiceRequest(operationId, patientId, amount)

        every { operationRepository.retrieve(operationId) } returns null

        assertThrows(OperationNotFoundException::class.java) {
            service.createInvoice(request)
        }

        verify(exactly = 1) { operationRepository.retrieve(operationId) }
        verify { invoiceRepository wasNot Called }
    }

    @Test
    fun `getInvoice delegates to repository`() {
        val invoiceId = InvoiceId("INV-1")
        val invoice = Invoice(
            invoiceId, OperationId("OP-1"), Money(BigDecimal.ONE), InvoiceStatus.PENDING,
            LocalDateTime.now(), LocalDateTime.now()
        )

        every { invoiceRepository.retrieve(invoiceId) } returns invoice

        val result = service.getInvoice(invoiceId)

        assertEquals(invoice, result)
        verify(exactly = 1) { invoiceRepository.retrieve(invoiceId) }
        confirmVerified(invoiceRepository)
    }

    @Test
    fun `getInvoicesForOperation delegates to repository`() {
        val opId = OperationId("OP-2")
        val invoices = listOf(
            Invoice(
                InvoiceId("INV-2"),
                opId,
                Money(BigDecimal("5")),
                InvoiceStatus.PENDING,
                LocalDateTime.now(),
                LocalDateTime.now()
            ),
            Invoice(
                InvoiceId("INV-3"),
                opId,
                Money(BigDecimal("7.5")),
                InvoiceStatus.PAID,
                LocalDateTime.now(),
                LocalDateTime.now()
            )
        )

        every { invoiceRepository.findByOperationId(opId) } returns invoices

        val result = service.getInvoicesForOperation(opId)
        assertEquals(invoices, result)
        verify(exactly = 1) { invoiceRepository.findByOperationId(opId) }
        confirmVerified(invoiceRepository)
    }

    @Test
    fun `getInvoicesForPatient delegates to repository`() {
        val invoices = listOf(
            Invoice(
                InvoiceId("INV-4"),
                OperationId("OP-4"),
                Money(BigDecimal("9")),
                InvoiceStatus.CANCELLED,
                LocalDateTime.now(),
                LocalDateTime.now()
            )
        )

        every { invoiceRepository.findByPatientId(patientId) } returns invoices

        val result = service.getInvoicesForPatient(patientId)
        assertEquals(invoices, result)
        verify(exactly = 1) { invoiceRepository.findByPatientId(patientId) }
        confirmVerified(invoiceRepository)
    }

    @Test
    fun `updateInvoiceStatus delegates to repository`() {
        val invoiceId = InvoiceId("INV-5")
        val updated = Invoice(
            invoiceId,
            OperationId("OP-9"),
            Money(BigDecimal("10")),
            InvoiceStatus.PAID,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        every { invoiceRepository.updateStatus(invoiceId, InvoiceStatus.PAID) } returns updated

        val result = service.updateInvoiceStatus(invoiceId, InvoiceStatus.PAID)

        assertEquals(updated, result)
        verify(exactly = 1) { invoiceRepository.updateStatus(invoiceId, InvoiceStatus.PAID) }
        confirmVerified(invoiceRepository)
    }

    companion object {
        private val operationId = OperationId("OP-123")
        private val patientId = PatientId("PAT-789")
        private val NOW = LocalDateTime.of(2025, 1, 2, 3, 4, 5)
        private val invoiceId = InvoiceId("INV-123")
    }
}