package domain.patient

import domain.generator.OperationIdGenerator
import domain.model.OperationId
import domain.model.OperationType
import domain.model.PatientId
import domain.model.PatientOperation
import domain.utils.DateTimeProvider

class OperationService(
    private val patientRepository: PatientRepository,
    private val operationRepository: OperationRepository,
    private val operationIdGenerator: OperationIdGenerator,
    private val dateTimeProvider: DateTimeProvider
) {

    fun createOperation(request: CreateOperationRequest): PatientOperation {
        patientRepository.retrieve(request.patientId)
            ?: throw IllegalArgumentException("Patient with id ${request.patientId} not found")

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
            ?: throw IllegalArgumentException("Patient with id $patientId not found")

        return operationRepository.findByPatientId(patientId)
    }

    fun getOperation(operationId: OperationId): PatientOperation? =
        operationRepository.retrieve(operationId)

    fun addOperationNote(operationId: OperationId, note: String): PatientOperation? =
        operationRepository.addNote(operationId, note)

    fun addOperationAsset(operationId: OperationId, assetName: String): PatientOperation? =
        operationRepository.addAsset(operationId, assetName)
}

data class CreateOperationRequest(
    val patientId: PatientId,
    val type: OperationType,
    val description: String,
    val notes: String? = null,
    val assets: List<String>? = null
)
