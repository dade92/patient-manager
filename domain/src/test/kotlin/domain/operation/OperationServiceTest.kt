package domain.operation

import domain.exceptions.PatientNotFoundException
import domain.generator.OperationIdGenerator
import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aCreateOperationRequest
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.anOperationId
import domain.model.OperationType
import domain.model.OperationType.SURGERY
import domain.model.PatientId
import domain.patient.PatientRepository
import domain.storage.StorageService
import domain.storage.UploadFileRequest
import domain.utils.DateTimeProvider
import io.mockk.Called
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.io.InputStream
import java.time.LocalDateTime

class OperationServiceTest {

    private val patientRepository: PatientRepository = mockk()
    private val operationRepository: OperationRepository = mockk()
    private val operationIdGenerator: OperationIdGenerator = mockk()
    private val dateTimeProvider: DateTimeProvider = mockk()
    private val storageService: StorageService = mockk()

    private val service = OperationService(
        patientRepository = patientRepository,
        operationRepository = operationRepository,
        operationIdGenerator = operationIdGenerator,
        dateTimeProvider = dateTimeProvider,
        storageService = storageService
    )

    @Test
    fun `createOperation creates operation with generated id and current time`() {
        val request = aCreateOperationRequest(
            patientId = PATIENT_ID,
            type = SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            estimatedCost = AMOUNT
        )

        val expected = aPatientOperation(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = SURGERY,
            description = DESCRIPTION,
            executor = EXECUTOR,
            creationDateTime = NOW,
            lastUpdate = NOW,
            estimatedCost = AMOUNT
        )

        every { patientRepository.retrieve(PATIENT_ID) } returns mockk(relaxed = true)
        every { operationIdGenerator.get() } returns OPERATION_ID
        every { dateTimeProvider.now() } returns NOW
        every { operationRepository.save(expected) } returns expected

        val result = service.createOperation(request)

        assertEquals(expected, result)
    }

    @Test
    fun `createOperation throws when patient is not found`() {
        val request = CreateOperationRequest(
            patientId = PATIENT_ID,
            type = OperationType.CONSULTATION,
            description = DESCRIPTION,
            executor = EXECUTOR,
            estimatedCost = AMOUNT
        )

        every { patientRepository.retrieve(PATIENT_ID) } returns null

        assertThrows(PatientNotFoundException::class.java) {
            service.createOperation(request)
        }

        verify(exactly = 1) { patientRepository.retrieve(PATIENT_ID) }
        verify { operationRepository wasNot Called }
    }

    @Test
    fun `getOperation delegates to repository`() {
        val operation = aPatientOperation(OPERATION_ID)

        every { operationRepository.retrieve(OPERATION_ID) } returns operation

        val result = service.getOperation(OPERATION_ID)

        assertEquals(operation, result)
    }

    @Test
    fun `retrieveOperationsBy validates patient exists then delegates`() {
        val operations = listOf(
            aPatientOperation(anOperationId()),
            aPatientOperation(anOperationId())
        )

        every { patientRepository.retrieve(PATIENT_ID) } returns mockk(relaxed = true)
        every { operationRepository.findByPatientId(PATIENT_ID) } returns operations

        val result = service.retrieveOperationsBy(PATIENT_ID)

        assertEquals(operations, result)
    }

    @Test
    fun `retrieveOperationsBy throws when patient not found`() {
        every { patientRepository.retrieve(PATIENT_ID) } returns null

        assertThrows(PatientNotFoundException::class.java) {
            service.retrieveOperationsBy(PATIENT_ID)
        }

        verify { operationRepository wasNot Called }
    }

    @Test
    fun `addOperationNote delegates to repository`() {
        val updatedPatientOperation = aPatientOperation(OPERATION_ID)

        every { operationRepository.addNote(OPERATION_ID, NOTE) } returns updatedPatientOperation

        val result = service.addOperationNote(OPERATION_ID, NOTE)

        assertEquals(updatedPatientOperation, result)
    }

    @Test
    fun `addOperationAsset uploads file then delegates to repository`() {
        val input: InputStream = mockk()
        val updatedPatientOperation = aPatientOperation(OPERATION_ID)

        every { storageService.uploadFile(any<UploadFileRequest>()) } returns Unit
        every { operationRepository.addAsset(OPERATION_ID, FILENAME) } returns updatedPatientOperation

        val result = service.addOperationAsset(
            operationId = OPERATION_ID,
            assetName = FILENAME,
            contentLength = 1234,
            contentType = "image/png",
            inputStream = input
        )

        assertEquals(updatedPatientOperation, result)
    }

    companion object {
        private val OPERATION_ID = anOperationId()
        private val PATIENT_ID = PatientId("PAT-789")
        private val AMOUNT = aMoney()
        private const val DESCRIPTION = "Appendectomy"
        private const val EXECUTOR = "Dr. Who"
        private const val FILENAME = "file1.png"
        private const val NOTE = "note"
        private val NOW = LocalDateTime.of(2025, 1, 2, 3, 4, 5)
    }
}