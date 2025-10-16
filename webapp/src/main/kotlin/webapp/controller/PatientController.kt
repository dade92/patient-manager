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
    fun getPatient(@PathVariable patientId: String): ResponseEntity<Patient> {
        val patient = patientService.retrievePatient(PatientId(patientId))
        return if (patient != null) {
            ResponseEntity.ok(patient)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/search")
    fun searchPatients(@RequestParam name: String): ResponseEntity<SearchPatientsResponse> {
        val patients = patientService.searchPatientsByName(name)
        return ResponseEntity.ok(SearchPatientsResponse(patients))
    }

    @PostMapping
    fun createPatient(@RequestBody request: CreatePatientRequest): ResponseEntity<Patient> {
        val domainRequest = DomainCreatePatientRequest(
            name = request.name,
            email = request.email,
            phoneNumber = request.phoneNumber,
            address = request.address,
            cityOfResidence = request.cityOfResidence,
            nationality = request.nationality,
            birthDate = request.birthDate,
            taxCode = request.taxCode
        )

        val patient = patientService.createPatient(domainRequest)
        return ResponseEntity.status(HttpStatus.CREATED).body(patient)
    }

    data class CreatePatientRequest(
        val name: String,
        val email: String,
        val phoneNumber: String? = null,
        val address: String? = null,
        val cityOfResidence: String? = null,
        val nationality: String? = null,
        val birthDate: LocalDate,
        val taxCode: String
    )

    data class SearchPatientsResponse(
        val patients: List<Patient>
    )
}
