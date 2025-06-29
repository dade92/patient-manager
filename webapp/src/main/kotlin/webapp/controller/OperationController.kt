package webapp.controller

import domain.model.OperationId
import domain.model.OperationType
import domain.model.PatientId
import domain.model.PatientOperation
import domain.patient.CreateOperationRequest
import domain.patient.OperationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/operations")
class OperationController(
    private val operationService: OperationService
) {

    @PostMapping
    fun createOperation(@RequestBody request: CreateOperationRequestDto): ResponseEntity<OperationResponseDto> {
        val domainRequest = CreateOperationRequest(
            patientId = PatientId(request.patientId),
            type = request.type,
            description = request.description,
            notes = request.notes,
            assets = request.assets
        )

        val operation = operationService.createOperation(domainRequest)
        return ResponseEntity.status(HttpStatus.CREATED).body(operation.toResponseDto())
    }

    @GetMapping("/{id}")
    fun getOperation(@PathVariable id: String): ResponseEntity<OperationResponseDto> {
        val operation = operationService.getOperation(OperationId(id))
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Operation not found")

        return ResponseEntity.ok(operation.toResponseDto())
    }

    @GetMapping("/patient/{patientId}")
    fun getPatientOperations(@PathVariable patientId: String): ResponseEntity<PatientOperationsResponse> {
        val operations = operationService.getOperationsBy(PatientId(patientId))

        return ResponseEntity.ok(PatientOperationsResponse(operations.map { it.toResponseDto() }))
    }

    @PostMapping("/{id}/notes")
    fun addOperationNote(
        @PathVariable id: String,
        @RequestBody request: AddOperationNoteRequestDto
    ): ResponseEntity<OperationResponseDto> {
        val operation = operationService.addOperationNote(OperationId(id), request.content)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Operation not found")

        return ResponseEntity.ok(operation.toResponseDto())
    }

    @PostMapping("/{id}/assets")
    fun addOperationAsset(
        @PathVariable id: String,
        @RequestBody request: AddOperationAssetRequestDto
    ): ResponseEntity<OperationResponseDto> {
        val operation = operationService.addOperationAsset(OperationId(id), request.assetName)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Operation not found")

        return ResponseEntity.ok(operation.toResponseDto())
    }

    private fun PatientOperation.toResponseDto(): OperationResponseDto =
        OperationResponseDto(
            id = this.id.value,
            patientId = this.patientId.value,
            type = this.type,
            description = this.description,
            assets = this.assets,
            additionalNotes = this.additionalNotes.map {
                OperationNoteDto(it.content, it.creationTime)
            },
            createdAt = this.creationDateTime,
            updatedAt = this.lastUpdate
        )

    data class CreateOperationRequestDto(
        val patientId: String,
        val type: OperationType,
        val description: String,
        val notes: String? = null,
        val assets: List<String>? = null
    )

    data class AddOperationNoteRequestDto(
        val content: String
    )

    data class AddOperationAssetRequestDto(
        val assetName: String
    )

    data class OperationResponseDto(
        val id: String,
        val patientId: String,
        val type: OperationType,
        val description: String,
        val assets: List<String>,
        val additionalNotes: List<OperationNoteDto>,
        val createdAt: LocalDateTime,
        val updatedAt: LocalDateTime
    )

    data class OperationNoteDto(
        val content: String,
        val createdAt: LocalDateTime
    )

    data class PatientOperationsResponse(
        val operations: List<OperationResponseDto>
    )
}
