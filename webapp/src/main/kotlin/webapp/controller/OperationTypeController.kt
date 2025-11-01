package webapp.controller

import domain.model.OperationType
import domain.operationtype.OperationTypeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import webapp.adapter.*

@RestController
@RequestMapping("/api")
class OperationTypeController(
    private val operationTypeService: OperationTypeService,
    private val operationTypeResponseAdapter: OperationTypeResponseAdapter
) {

    @PostMapping("/operation-type")
    fun createOperationType(
        @RequestBody request: CreateOperationTypeRequest
    ): ResponseEntity<OperationTypeResponse> =
        operationTypeService.save(
            OperationType(
                type = request.type,
                description = request.description,
                estimatedBaseCost = request.estimatedBaseCost.toDomain()
            )
        ).let {
            ResponseEntity.status(HttpStatus.CREATED)
                .body(operationTypeResponseAdapter.adapt(it))
        }

    @GetMapping("/operation-types")
    fun getAll(): ResponseEntity<OperationTypeListResponse> =
        ResponseEntity.ok(
            OperationTypeListResponse(
                operationTypeResponseAdapter.adaptAll(
                    operationTypeService.retrieve()
                )
            )
        )
}

