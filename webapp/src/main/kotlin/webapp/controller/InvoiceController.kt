package webapp.controller

import domain.invoice.CreateInvoiceRequest
import domain.invoice.InvoiceService
import domain.model.InvoiceId
import domain.model.InvoiceStatus
import domain.model.Money
import domain.model.OperationId
import domain.model.PatientId
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import webapp.adapter.*

@RestController
@RequestMapping("/api/invoice")
class InvoiceController(
    private val invoiceService: InvoiceService,
    private val invoiceResponseAdapter: InvoiceResponseAdapter
) {

    @PostMapping
    fun createInvoice(
        @RequestBody requestDto: CreateInvoiceJsonRequest
    ): ResponseEntity<InvoiceResponse> =
        invoiceService.createInvoice(
            CreateInvoiceRequest(
                operationId = OperationId(requestDto.operationId),
                patientId = PatientId(requestDto.patientId),
                amount = Money(
                    amount = requestDto.amount.amount,
                    currency = requestDto.amount.currency
                )
            )
        ).let {
            ResponseEntity(invoiceResponseAdapter.adapt(it), HttpStatus.CREATED)
        }

    @GetMapping("/{invoiceId}")
    fun getInvoice(@PathVariable invoiceId: String): ResponseEntity<InvoiceResponse> =
        invoiceService.getInvoice(InvoiceId(invoiceId))?.let {
            ResponseEntity(
                invoiceResponseAdapter.adapt(it),
                HttpStatus.OK
            )
        } ?: ResponseEntity(HttpStatus.NOT_FOUND)

    @GetMapping("/operation/{operationId}")
    fun getInvoicesForOperation(@PathVariable operationId: String): ResponseEntity<Invoices> =
        invoiceService.getInvoicesForOperation(OperationId(operationId))
            .let { invoices ->
                ResponseEntity(
                    Invoices(invoices = invoices.map { invoiceResponseAdapter.adapt(it) }),
                    HttpStatus.OK
                )
            }

    @GetMapping("/patient/{patientId}")
    fun getInvoicesForPatient(@PathVariable patientId: String): ResponseEntity<Invoices> =
        invoiceService.getInvoicesForPatient(PatientId(patientId))
            .let { invoices ->
                ResponseEntity(
                    Invoices(invoices = invoices.map { invoiceResponseAdapter.adapt(it) }),
                    HttpStatus.OK
                )
            }

    @PostMapping("/{invoiceId}/status")
    fun updateInvoiceStatus(
        @PathVariable invoiceId: String,
        @RequestBody requestDto: UpdateInvoiceStatusJsonRequest
    ): ResponseEntity<InvoiceResponse> =
        invoiceService.updateInvoiceStatus(
            InvoiceId(invoiceId),
            InvoiceStatus.valueOf(requestDto.status)
        )
            ?.let { ResponseEntity(invoiceResponseAdapter.adapt(it), HttpStatus.OK) }
            ?: ResponseEntity(HttpStatus.NOT_FOUND)

    data class CreateInvoiceJsonRequest(
        val operationId: String,
        val patientId: String,
        val amount: MoneyDto,
    )

    data class UpdateInvoiceStatusJsonRequest(
        val status: String
    )
}

