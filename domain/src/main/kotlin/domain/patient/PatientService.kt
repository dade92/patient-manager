package domain.patient

import domain.generator.PatientIdGenerator
import domain.invoice.InvoiceRepository
import domain.model.Patient
import domain.model.PatientId
import domain.operation.OperationRepository
import domain.storage.StorageService
import java.time.LocalDate

class PatientService(
    private val patientRepository: PatientRepository,
    private val patientIdGenerator: PatientIdGenerator,
    private val operationRepository: OperationRepository,
    private val invoiceRepository: InvoiceRepository,
    private val storageService: StorageService
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
                birthDate = request.birthDate,
                taxCode = request.taxCode,
                medicalHistory = request.medicalHistory
            )
        )

    fun searchPatientsByName(name: String): List<Patient> = patientRepository.searchByName(name)

    fun delete(patientId: PatientId) {
        invoiceRepository.findByPatientId(patientId).forEach { invoice ->
            invoiceRepository.delete(invoice.id)
        }
        operationRepository.findByPatientId(patientId).forEach { operation ->
            operation.assets.forEach { assetKey ->
                storageService.deleteFile(assetKey)
            }
            operationRepository.delete(operation.id)
        }

        patientRepository.delete(patientId)
    }
}

data class CreatePatientRequest(
    val name: String,
    val email: String,
    val phoneNumber: String?,
    val address: String?,
    val cityOfResidence: String?,
    val nationality: String?,
    val birthDate: LocalDate,
    val taxCode: String,
    val medicalHistory: String
)
