package webapp.controller

import domain.model.Patient
import domain.model.PatientId
import domain.patient.PatientService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import domain.patient.CreatePatientRequest as DomainCreatePatientRequest

@RestController
@RequestMapping("/api/patient")
class PatientController(
    private val patientService: PatientService
) {
    @GetMapping("/{patientId}")
    fun getPatient(@PathVariable patientId: String): ResponseEntity<Patient> =
        patientService.retrievePatient(PatientId(patientId))
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/search")
    fun searchPatients(@RequestParam name: String): ResponseEntity<SearchPatientsResponse> =
        ResponseEntity.ok(
            SearchPatientsResponse(patientService.searchPatientsByName(name))
        )

    @PostMapping
    fun createPatient(@RequestBody request: CreatePatientRequest): ResponseEntity<Patient> =
        patientService.createPatient(
            DomainCreatePatientRequest(
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
        ).let {
            ResponseEntity.status(HttpStatus.CREATED).body(it)
        }

    @PostMapping("/delete/{patientId}")
    fun deletePatient(@PathVariable patientId: String): ResponseEntity<Void> {
        patientService.delete(PatientId(patientId))
        return ResponseEntity.noContent().build()
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

    data class SearchPatientsResponse(
        val patients: List<Patient>
    )
}
