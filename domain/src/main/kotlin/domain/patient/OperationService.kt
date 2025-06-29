package domain.patient

import domain.exceptions.PatientNotFoundException
import domain.generator.OperationIdGenerator
import domain.model.OperationId
import domain.model.OperationType
import domain.model.PatientId
import domain.model.PatientOperation
import domain.storage.StorageService
import domain.storage.UploadFileRequest
import domain.utils.DateTimeProvider
import java.io.InputStream

class OperationService(
    private val patientRepository: PatientRepository,
    private val operationRepository: OperationRepository,
    private val operationIdGenerator: OperationIdGenerator,
    private val dateTimeProvider: DateTimeProvider,
    private val storageService: StorageService
) {

    fun createOperation(request: CreateOperationRequest): PatientOperation {
        patientRepository.retrieve(request.patientId)
            ?: throw PatientNotFoundException(request.patientId)

        val now = dateTimeProvider.now()

        return operationRepository.save(
            PatientOperation(
                id = operationIdGenerator.get(),
                patientId = request.patientId,
                type = request.type,
                description = request.description,
                assets = request.assets ?: emptyList(),
                creationDateTime = now,
                lastUpdate = now,
                additionalNotes = emptyList()
            )
        )
    }

    fun retrieveOperationsBy(patientId: PatientId): List<PatientOperation> {
        patientRepository.retrieve(patientId)
            ?: throw PatientNotFoundException(patientId)

        return operationRepository.findByPatientId(patientId)
    }

    fun getOperation(operationId: OperationId): PatientOperation? =
        operationRepository.retrieve(operationId)

    fun addOperationNote(operationId: OperationId, note: String): PatientOperation? =
        operationRepository.addNote(operationId, note)

    fun addOperationAsset(
        operationId: OperationId,
        assetName: String,
        contentLength: Long,
        contentType: String,
        inputStream: InputStream
    ): PatientOperation? {
        storageService.uploadFile(
            UploadFileRequest(
                key = assetName,
                contentLength = contentLength,
                contentType = contentType,
                inputStream = inputStream
            )
        )

        return operationRepository.addAsset(operationId, assetName)
    }
}

data class CreateOperationRequest(
    val patientId: PatientId,
    val type: OperationType,
    val description: String,
    val notes: String? = null,
    val assets: List<String>? = null
)
