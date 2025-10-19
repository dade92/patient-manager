package domain.operation

import domain.exceptions.PatientNotFoundException
import domain.generator.OperationIdGenerator
import domain.model.*
import domain.patient.PatientRepository
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
                executor = request.executor,
                creationDateTime = now,
                lastUpdate = now,
                estimatedCost = request.estimatedCost,
                info = request.patientOperationInfo
            )
        )
    }

    fun getOperation(operationId: OperationId): PatientOperation? =
        operationRepository.retrieve(operationId)

    fun retrieveOperationsBy(patientId: PatientId): List<PatientOperation> {
        patientRepository.retrieve(patientId)
            ?: throw PatientNotFoundException(patientId)

        return operationRepository.findByPatientId(patientId)
    }

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
    val executor: String,
    val estimatedCost: Money,
    val patientOperationInfo: PatientOperationInfo
)
