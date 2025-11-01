package domain.patient

import domain.model.Patient
import domain.model.PatientId

interface PatientRepository {
    fun retrieve(patientId: PatientId): Patient?
    fun save(patient: Patient): Patient
    fun searchByName(name: String): List<Patient>
    fun delete(patientId: PatientId)
}
