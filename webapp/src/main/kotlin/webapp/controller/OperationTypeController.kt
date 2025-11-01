package webapp.controller

import domain.model.OperationType
import domain.operationtype.OperationTypeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import webapp.adapter.CreateOperationTypeRequest
import webapp.adapter.OperationTypeResponse
import webapp.adapter.OperationTypeResponseAdapter
import webapp.adapter.toDomain

@RestController
@RequestMapping("/api/operation-type")
class OperationTypeController(
    private val operationTypeService: OperationTypeService,
    private val operationTypeResponseAdapter: OperationTypeResponseAdapter
) {

    @PostMapping
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

    @GetMapping
    fun getAll(): ResponseEntity<List<OperationTypeResponse>> =
        ResponseEntity.ok(
            operationTypeResponseAdapter.adaptAll(operationTypeService.retrieve())
        )
}

