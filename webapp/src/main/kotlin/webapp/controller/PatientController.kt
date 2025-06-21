package webapp.controller

import domain.model.Patient
import domain.model.PatientId
import domain.patient.CreatePatientRequest as DomainCreatePatientRequest
import domain.patient.PatientService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("/patient")
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
            birthDate = request.birthDate
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
        val birthDate: LocalDate
    )

    data class SearchPatientsResponse(
        val patients: List<Patient>
    )
}
