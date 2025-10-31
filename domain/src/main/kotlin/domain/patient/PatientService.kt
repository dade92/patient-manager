package domain.patient

import domain.generator.PatientIdGenerator
import domain.model.Patient
import domain.model.PatientId
import java.time.LocalDate

class PatientService(
    private val patientRepository: PatientRepository,
    private val patientIdGenerator: PatientIdGenerator
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

    fun delete(patientId: PatientId) = patientRepository.delete(patientId)
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
