package domain.operation

import domain.exceptions.PatientNotFoundException
import domain.generator.OperationIdGenerator
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aCreateOperationRequest
import domain.model.OperationBuilder.aDetail
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.aPatientOperationInfo
import domain.model.OperationBuilder.anOperationId
import domain.model.OperationType.SURGERY
import domain.model.PatientBuilder.aPatient
import domain.model.PatientBuilder.aPatientId
import domain.operation.validator.OperationRequestValidator
import domain.patient.PatientRepository
import domain.storage.StorageService
import domain.storage.UploadFileRequest
import domain.utils.DateTimeProvider
import io.mockk.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.io.InputStream
import java.time.LocalDateTime

class OperationServiceTest {

    private val patientRepository = mockk<PatientRepository>()
    private val operationRepository = mockk<OperationRepository>()
    private val operationIdGenerator = mockk<OperationIdGenerator>()
    private val dateTimeProvider = mockk<DateTimeProvider>()
    private val storageService = mockk<StorageService>()
    private val operationRequestValidator = mockk<OperationRequestValidator>()

    private val operationService = OperationService(
        patientRepository = patientRepository,
        operationRepository = operationRepository,
        operationIdGenerator = operationIdGenerator,
        dateTimeProvider = dateTimeProvider,
        storageService = storageService,
        operationRequestValidator = operationRequestValidator
    )

    @Test
    fun `createOperation creates operation with generated id and current time`() {
        val request = aCreateOperationRequest(
            patientId = PATIENT_ID,
            type = SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            estimatedCost = AMOUNT,
            patientOperationInfo = PATIENT_OPERATION_INFO
        )

        val expected = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            creationDateTime = NOW,
            lastUpdate = NOW,
            estimatedCost = AMOUNT,
            info = PATIENT_OPERATION_INFO
        )

        every { operationRequestValidator.validate(request) } just Runs
        every { patientRepository.retrieve(PATIENT_ID) } returns PATIENT
        every { operationIdGenerator.get() } returns OPERATION_ID
        every { dateTimeProvider.now() } returns NOW
        every { operationRepository.save(expected) } returns expected

        val result = operationService.createOperation(request)

        assertEquals(expected, result)
    }

    @Test
    fun `createOperation throws PatientNotFoundException when patient is not found`() {
        val request = aCreateOperationRequest(
            patientId = PATIENT_ID,
        )

        every { operationRequestValidator.validate(request) } just Runs
        every { patientRepository.retrieve(PATIENT_ID) } returns null

        assertThrows(PatientNotFoundException::class.java) {
            operationService.createOperation(request)
        }

        verify(exactly = 1) { patientRepository.retrieve(PATIENT_ID) }
        verify { operationRepository wasNot Called }
    }

    @Test
    fun `getOperation delegates to repository`() {
        val operation = aPatientOperation(OPERATION_ID)

        every { operationRepository.retrieve(OPERATION_ID) } returns operation

        val result = operationService.getOperation(OPERATION_ID)

        assertEquals(operation, result)
    }

    @Test
    fun `retrieveOperationsBy validates patient exists then delegates`() {
        val operations = listOf(
            aPatientOperation(anOperationId()),
            aPatientOperation(anOperationId())
        )

        every { patientRepository.retrieve(PATIENT_ID) } returns PATIENT
        every { operationRepository.findByPatientId(PATIENT_ID) } returns operations

        val result = operationService.retrieveOperationsBy(PATIENT_ID)

        assertEquals(operations, result)
    }

    @Test
    fun `retrieveOperationsBy throws PatientNotFoundException when patient not found`() {
        every { patientRepository.retrieve(PATIENT_ID) } returns null

        assertThrows(PatientNotFoundException::class.java) {
            operationService.retrieveOperationsBy(PATIENT_ID)
        }

        verify { operationRepository wasNot Called }
    }

    @Test
    fun `addOperationNote delegates to repository`() {
        val updatedPatientOperation = aPatientOperation(OPERATION_ID)

        every { operationRepository.addNote(OPERATION_ID, NOTE) } returns updatedPatientOperation

        val result = operationService.addOperationNote(OPERATION_ID, NOTE)

        assertEquals(updatedPatientOperation, result)
    }

    @Test
    fun `addOperationAsset uploads file then delegates to repository`() {
        val input: InputStream = mockk()
        val updatedPatientOperation = aPatientOperation(OPERATION_ID)

        every { storageService.uploadFile(any<UploadFileRequest>()) } returns Unit
        every { operationRepository.addAsset(OPERATION_ID, FILENAME) } returns updatedPatientOperation

        val result = operationService.addOperationAsset(
            operationId = OPERATION_ID,
            assetName = FILENAME,
            contentLength = 1234,
            contentType = "image/png",
            inputStream = input
        )

        assertEquals(updatedPatientOperation, result)
    }

    @Test
    fun `if upload file fails propagates exception and does not save asset`() {
        val input: InputStream = mockk()
        val exception = RuntimeException("error")

        every { storageService.uploadFile(any<UploadFileRequest>()) } throws exception

        assertThrows<RuntimeException> {
            operationService.addOperationAsset(
                operationId = OPERATION_ID,
                assetName = FILENAME,
                contentLength = 1234,
                contentType = "image/png",
                inputStream = input
            )
        }

        verify { operationRepository wasNot Called }
    }

    companion object {
        private val OPERATION_ID = anOperationId()
        private val PATIENT_ID = aPatientId()
        private val PATIENT = aPatient()
        private val AMOUNT = aMoney()
        private const val DESCRIPTION = "Appendectomy"
        private const val EXECUTOR = "Dr. Who"
        private const val FILENAME = "file1.png"
        private const val NOTE = "note"
        private val NOW = LocalDateTime.of(2025, 1, 2, 3, 4, 5)
        private val PATIENT_OPERATION_INFO = aPatientOperationInfo(listOf(aDetail()))
    }
}