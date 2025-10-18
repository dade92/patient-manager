package webapp.controller

import domain.model.*
import domain.operation.CreateOperationRequest
import domain.operation.OperationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
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
                estimatedCost = request.estimatedCost.toDomain(),
                patientOperationInfo = request.patientOperationInfo.toDomain()
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
    ): ResponseEntity<PatientOperationsResponse> =
        ResponseEntity.ok(
            PatientOperationsResponse(
                operationService.retrieveOperationsBy(PatientId(patientId)).map { it.toResponse() }
            )
        )

    @PostMapping("/{id}/notes")
    fun addOperationNote(
        @PathVariable id: String,
        @RequestBody request: AddOperationNoteJsonRequest
    ): ResponseEntity<OperationResponse> =
        operationService.addOperationNote(OperationId(id), request.content)
            ?.let { ResponseEntity.ok(it.toResponse()) }
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
                )?.let { ResponseEntity.ok(it.toResponse()) } ?: ResponseEntity.notFound().build()
            } ?: ResponseEntity.badRequest().build()

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
            patientOperationInfo = this.info.toDto()
        )

    companion object {
        private val DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
        private fun MoneyDto.toDomain() = Money(amount = this.amount, currency = this.currency)
        private fun Money.toDto() = MoneyDto(amount = this.amount, currency = this.currency)
        private fun PatientOperationInfo.toDto() =
            PatientOperationInfoDto(
                details = this.details.map { DetailDto(it.toothNumber, it.estimatedCost.toDto()) }
            )

        private fun PatientOperationInfoDto.toDomain() =
            PatientOperationInfo(details = this.details.map {
                Detail(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDomain()
                )
            })
    }

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
        val estimatedCost: MoneyDto,
        val patientOperationInfo: PatientOperationInfoDto
    )

    data class OperationNoteResponse(
        val content: String,
        val createdAt: String
    )

    data class PatientOperationsResponse(
        val operations: List<OperationResponse>
    )

    data class PatientOperationInfoDto(
        val details: List<DetailDto>
    )

    data class DetailDto(
        val toothNumber: Int,
        val estimatedCost: MoneyDto
    )
}
