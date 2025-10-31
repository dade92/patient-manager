package domain.patient

import domain.generator.PatientIdGenerator
import domain.invoice.InvoiceRepository
import domain.model.InvoiceBuilder.anInvoice
import domain.model.InvoiceBuilder.anInvoiceId
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.anOperationId
import domain.model.PatientBuilder.aCreatePatientRequest
import domain.model.PatientBuilder.aPatient
import domain.model.PatientBuilder.aPatientId
import domain.operation.OperationRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class PatientServiceTest {

    private val patientRepository = mockk<PatientRepository>()
    private val patientIdGenerator = mockk<PatientIdGenerator>()
    private val operationRepository = mockk<OperationRepository>()
    private val invoiceRepository = mockk<InvoiceRepository>()

    private val patientService = PatientService(
        patientRepository = patientRepository,
        patientIdGenerator = patientIdGenerator,
        operationRepository = operationRepository,
        invoiceRepository = invoiceRepository
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

        val result = patientService.createPatient(request)

        assertEquals(expected, result)
    }

    @Test
    fun `retrievePatient delegates to repository`() {
        val patient = aPatient(id = PATIENT_ID)

        every { patientRepository.retrieve(PATIENT_ID) } returns patient

        val result = patientService.retrievePatient(PATIENT_ID)

        assertEquals(patient, result)
    }

    @Test
    fun `searchPatientsByName delegates to repository`() {
        val patients = listOf(
            aPatient(PATIENT_ID),
            aPatient(ANOTHER_PATIENT_ID)
        )

        every { patientRepository.searchByName(NAME) } returns patients

        val result = patientService.searchPatientsByName(NAME)

        assertEquals(patients, result)
    }

    @Test
    fun `delete removes all invoices, operations and then patient in correct order`() {
        val operation1 = aPatientOperation(id = OPERATION_ID_1, patientId = PATIENT_ID)
        val operation2 = aPatientOperation(id = OPERATION_ID_2, patientId = PATIENT_ID)
        val operations = listOf(operation1, operation2)
        val invoice1 = anInvoice(id = INVOICE_ID_1, operationId = OPERATION_ID_1)
        val invoice2 = anInvoice(id = INVOICE_ID_2, operationId = OPERATION_ID_1)

        every { invoiceRepository.findByPatientId(PATIENT_ID) } returns listOf(invoice1, invoice2)
        every { operationRepository.findByPatientId(PATIENT_ID) } returns operations
        every { invoiceRepository.delete(any()) } returns Unit
        every { operationRepository.delete(any()) } returns Unit
        every { patientRepository.delete(PATIENT_ID) } returns Unit

        patientService.delete(PATIENT_ID)

        verify { invoiceRepository.delete(INVOICE_ID_1) }
        verify { invoiceRepository.delete(INVOICE_ID_2) }
        verify { operationRepository.delete(OPERATION_ID_1) }
        verify { operationRepository.delete(OPERATION_ID_2) }
        verify { patientRepository.delete(PATIENT_ID) }
    }

    companion object {
        private val PATIENT_ID = aPatientId("PAT-999")
        private val ANOTHER_PATIENT_ID = aPatientId("PAT-888")
        private val OPERATION_ID_1 = anOperationId("OP-001")
        private val OPERATION_ID_2 = anOperationId("OP-002")
        private val INVOICE_ID_1 = anInvoiceId("INV-001")
        private val INVOICE_ID_2 = anInvoiceId("INV-002")
        private val INVOICE_ID_3 = anInvoiceId("INV-003")
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