package domain.model

import java.time.LocalDate

object PatientBuilder {

    fun aPatientId(value: String = "PATIENT-123") = PatientId(value)

    fun aPatient(
        id: PatientId = aPatientId(),
        name: String = "John Doe",
        email: String = "john.doe@example.com",
        phoneNumber: String? = "1234567890",
        address: String? = "123 Main St",
        cityOfResidence: String? = "Springfield",
        nationality: String? = "Italian",
        birthDate: LocalDate = LocalDate.of(1990, 1, 1),
        taxCode: String = "TAXCODE123"
    ) = Patient(
        id = id,
        name = name,
        email = email,
        phoneNumber = phoneNumber,
        address = address,
        cityOfResidence = cityOfResidence,
        nationality = nationality,
        birthDate = birthDate,
        taxCode = taxCode
    )

    fun aCreatePatientRequest(
        name: String = "John Doe",
        email: String = "john.doe@example.com",
        phoneNumber: String? = "1234567890",
        address: String? = "123 Main St",
        cityOfResidence: String? = "Springfield",
        nationality: String? = "Italian",
        birthDate: LocalDate = LocalDate.of(1990, 1, 1),
        taxCode: String = "TAXCODE123"
    ) = domain.patient.CreatePatientRequest(
        name = name,
        email = email,
        phoneNumber = phoneNumber,
        address = address,
        cityOfResidence = cityOfResidence,
        nationality = nationality,
        birthDate = birthDate,
        taxCode = taxCode
    )
}