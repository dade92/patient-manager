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
                birthDate = request.birthDate
            )
        )

    fun searchPatientsByName(name: String): List<Patient> = patientRepository.searchByName(name)
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