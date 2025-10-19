package webapp.controller

import domain.model.OperationId
import domain.model.OperationType
import domain.model.PatientId
import domain.operation.CreateOperationRequest
import domain.operation.OperationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import webapp.adapter.*

@RestController
@RequestMapping("/api/operation")
class OperationController(
    private val operationService: OperationService,
    private val patientOperationResponseAdapter: PatientOperationResponseAdapter
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
                estimatedCost = request.estimatedCost.toDomain(),
                patientOperationInfo = request.patientOperationInfo.toDomain()
            )
        ).let {
            ResponseEntity.status(HttpStatus.CREATED).body(patientOperationResponseAdapter.adapt(it))
        }

    @GetMapping("/{id}")
    fun getOperation(
        @PathVariable id: String
    ): ResponseEntity<OperationResponse> =
        operationService.getOperation(OperationId(id))
            ?.let { ResponseEntity.ok(patientOperationResponseAdapter.adapt(it)) }
            ?: ResponseEntity.notFound().build()

    @GetMapping("/patient/{patientId}")
    fun getPatientOperations(
        @PathVariable patientId: String
    ): ResponseEntity<PatientOperationsResponse> =
        ResponseEntity.ok(
            PatientOperationsResponse(
                operationService.retrieveOperationsBy(PatientId(patientId))
                    .map { patientOperationResponseAdapter.adapt(it) }
            )
        )

    @PostMapping("/{id}/notes")
    fun addOperationNote(
        @PathVariable id: String,
        @RequestBody request: AddOperationNoteJsonRequest
    ): ResponseEntity<OperationResponse> =
        operationService.addOperationNote(OperationId(id), request.content)
            ?.let { ResponseEntity.ok(patientOperationResponseAdapter.adapt(it)) }
            ?: ResponseEntity.notFound().build()

    @PostMapping("/{id}/assets")
    fun addOperationAsset(
        @PathVariable id: String,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<OperationResponse> =
        file.originalFilename
            ?.takeIf { it.isNotBlank() }
            ?.let { filename ->
                operationService.addOperationAsset(
                    operationId = OperationId(id),
                    assetName = filename,
                    contentLength = file.size,
                    contentType = file.contentType ?: "application/octet-stream",
                    inputStream = file.inputStream
                )?.let { ResponseEntity.ok(patientOperationResponseAdapter.adapt(it)) } ?: ResponseEntity.notFound()
                    .build()
            } ?: ResponseEntity.badRequest().build()

    data class CreateOperationJsonRequest(
        val patientId: String,
        val type: OperationType,
        val description: String,
        val executor: String,
        val estimatedCost: MoneyDto,
        val patientOperationInfo: PatientOperationInfoDto
    )

    data class AddOperationNoteJsonRequest(
        val content: String
    )
}
