package domain.patient

import domain.generator.OperationIdGenerator
import domain.generator.PatientIdGenerator
import domain.model.*
import java.time.LocalDate
import java.time.LocalDateTime

class PatientService(
    private val patientRepository: PatientRepository,
    private val operationRepository: OperationRepository,
    private val patientIdGenerator: PatientIdGenerator,
    private val operationIdGenerator: OperationIdGenerator
) {

    fun retrievePatient(patientId: PatientId): Patient? = patientRepository.retrieve(patientId)

    fun createPatient(request: CreatePatientRequest): Patient =
        patientRepository.save(
            Patient(
                id = PatientId(patientIdGenerator.get().value),
                name = request.name,
                email = request.email,
                phoneNumber = request.phoneNumber,
                address = request.address,
                cityOfResidence = request.cityOfResidence,
                nationality = request.nationality,
                birthDate = request.birthDate
            )
        )

    fun searchPatientsByName(name: String): List<Patient> = patientRepository.searchByName(name)

    // Patient Operation methods

    fun createOperation(request: CreateOperationRequest): PatientOperation {
        // Validate that patient exists
        val patient = patientRepository.retrieve(request.patientId)
            ?: throw IllegalArgumentException("Patient with id ${request.patientId} not found")

        return operationRepository.save(
            PatientOperation(
                id = operationIdGenerator.get(),
                patientId = request.patientId,
                type = request.type,
                description = request.description,
                assets = request.assets ?: emptyList(),
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        )
    }

    fun getPatientOperations(patientId: PatientId): List<PatientOperation> {
        // Validate that patient exists
        val patient = patientRepository.retrieve(patientId)
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

data class CreatePatientRequest(
    val name: String,
    val email: String,
    val phoneNumber: String? = null,
    val address: String? = null,
    val cityOfResidence: String? = null,
    val nationality: String? = null,
    val birthDate: LocalDate
)

data class CreateOperationRequest(
    val patientId: PatientId,
    val type: OperationType,
    val description: String,
    val notes: String? = null,
    val assets: List<String>? = null
)
