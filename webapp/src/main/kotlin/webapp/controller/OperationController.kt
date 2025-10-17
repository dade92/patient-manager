package webapp.controller

import domain.model.Money
import domain.model.OperationId
import domain.model.OperationType
import domain.model.PatientId
import domain.model.PatientOperation
import domain.operation.CreateOperationRequest
import domain.operation.OperationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/api/operation")
class OperationController(
    private val operationService: OperationService
) {

    @PostMapping
    fun createOperation(
        @RequestBody request: CreateOperationJsonRequest
    ): ResponseEntity<OperationResponse> =
        operationService.createOperation(
            CreateOperationRequest(
                patientId = PatientId(request.patientId),
                type = request.type,
                description = request.description,
                executor = request.executor,
                estimatedCost = request.estimatedCost.toDomain()
            )
        ).let {
            ResponseEntity.status(HttpStatus.CREATED).body(it.toResponse())
        }

    @GetMapping("/{id}")
    fun getOperation(
        @PathVariable id: String
    ): ResponseEntity<OperationResponse> =
        operationService.getOperation(OperationId(id))
            ?.let { ResponseEntity.ok(it.toResponse()) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/patient/{patientId}")
    fun getPatientOperations(
        @PathVariable patientId: String
    ): ResponseEntity<PatientOperationsResponse> {
        val operations = operationService.retrieveOperationsBy(PatientId(patientId))

        return ResponseEntity.ok(PatientOperationsResponse(operations.map { it.toResponse() }))
    }

    @PostMapping("/{id}/notes")
    fun addOperationNote(
        @PathVariable id: String,
        @RequestBody request: AddOperationNoteJsonRequest
    ): ResponseEntity<OperationResponse> {
        val operation = operationService.addOperationNote(OperationId(id), request.content)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Operation not found")

        return ResponseEntity.ok(operation.toResponse())
    }

    @PostMapping("/{id}/assets")
    fun addOperationAsset(
        @PathVariable id: String,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<OperationResponse> {
        val filename = file.originalFilename ?: return ResponseEntity
            .badRequest()
            .build()

        val operation = operationService.addOperationAsset(
            operationId = OperationId(id),
            assetName = filename,
            contentLength = file.size,
            contentType = file.contentType ?: "application/octet-stream",
            inputStream = file.inputStream
        ) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Operation not found")

        return ResponseEntity.ok(operation.toResponse())
    }

    private fun PatientOperation.toResponse(): OperationResponse =
        OperationResponse(
            id = this.id.value,
            patientId = this.patientId.value,
            type = this.type,
            description = this.description,
            executor = this.executor,
            assets = this.assets,
            additionalNotes = this.additionalNotes.map {
                OperationNoteResponse(it.content, it.creationTime.format(DATE_FORMATTER))
            },
            createdAt = this.creationDateTime.format(DATE_FORMATTER),
            updatedAt = this.lastUpdate.format(DATE_FORMATTER),
            estimatedCost = this.estimatedCost.toDto(),
        )

    companion object {
        private val DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
    }

    data class CreateOperationJsonRequest(
        val patientId: String,
        val type: OperationType,
        val description: String,
        val executor: String,
        val estimatedCost: MoneyDto
    )

    data class AddOperationNoteJsonRequest(
        val content: String
    )

    data class OperationResponse(
        val id: String,
        val patientId: String,
        val type: OperationType,
        val description: String,
        val executor: String,
        val assets: List<String>,
        val additionalNotes: List<OperationNoteResponse>,
        val createdAt: String,
        val updatedAt: String,
        val estimatedCost: MoneyDto
    )

    data class OperationNoteResponse(
        val content: String,
        val createdAt: String
    )

    data class PatientOperationsResponse(
        val operations: List<OperationResponse>
    )

    private fun MoneyDto.toDomain() = Money(amount = this.amount, currency = this.currency)
    private fun Money.toDto() = MoneyDto(amount = this.amount, currency = this.currency)
}
