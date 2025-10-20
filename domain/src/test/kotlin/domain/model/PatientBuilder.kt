package domain.model

import domain.patient.CreatePatientRequest
import java.time.LocalDate

object PatientBuilder {

    fun aPatientId(value: String = "PATIENT-123") = PatientId(value)

    fun aPatient(
        id: PatientId = aPatientId(),
        name: String = "John Doe",
        email: String = "john.doe@example.com",
        phoneNumber: String? = null,
        address: String? = null,
        cityOfResidence: String? = null,
        nationality: String? = null,
        birthDate: LocalDate = LocalDate.of(1990, 1, 1),
        taxCode: String = "TAXCODE123",
        medicalHistory: String = ""
    ) = Patient(
        id = id,
        name = name,
        email = email,
        phoneNumber = phoneNumber,
        address = address,
        cityOfResidence = cityOfResidence,
        nationality = nationality,
        birthDate = birthDate,
        taxCode = taxCode,
        medicalHistory = medicalHistory
    )

    fun aCreatePatientRequest(
        name: String = "John Doe",
        email: String = "john.doe@example.com",
        phoneNumber: String? = null,
        address: String? = null,
        cityOfResidence: String? = null,
        nationality: String? = null,
        birthDate: LocalDate = LocalDate.of(1990, 1, 1),
        taxCode: String = "TAXCODE123",
        medicalHistory: String = ""
    ) = CreatePatientRequest(
        name = name,
        email = email,
        phoneNumber = phoneNumber,
        address = address,
        cityOfResidence = cityOfResidence,
        nationality = nationality,
        birthDate = birthDate,
        taxCode = taxCode,
        medicalHistory = medicalHistory
    )
}