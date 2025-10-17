package webapp.controller

import domain.invoice.CreateInvoiceRequest
import domain.invoice.InvoiceService
import domain.model.Invoice
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
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/api/invoice")
class InvoiceController(
    private val invoiceService: InvoiceService
) {

    private val dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")

    @PostMapping
    fun createInvoice(
        @RequestBody requestDto: CreateInvoiceJsonRequest
    ): ResponseEntity<InvoiceResponse> {
        val request = CreateInvoiceRequest(
            operationId = OperationId(requestDto.operationId),
            patientId = PatientId(requestDto.patientId),
            amount = Money(
                amount = requestDto.amount.amount,
                currency = requestDto.amount.currency
            )
        )

        val invoice = invoiceService.createInvoice(request)

        return ResponseEntity(mapToResponse(invoice), HttpStatus.CREATED)
    }

    @GetMapping("/{invoiceId}")
    fun getInvoice(@PathVariable invoiceId: String): ResponseEntity<InvoiceResponse> =
        invoiceService.getInvoice(InvoiceId(invoiceId))?.let {
            ResponseEntity(
                mapToResponse(it),
                HttpStatus.OK
            )
        } ?: ResponseEntity(HttpStatus.NOT_FOUND)

    @GetMapping("/operation/{operationId}")
    fun getInvoicesForOperation(@PathVariable operationId: String): ResponseEntity<InvoicesPerOperationResponse> =
        invoiceService.getInvoicesForOperation(OperationId(operationId)).let { invoices ->
            ResponseEntity(
                InvoicesPerOperationResponse(invoices = invoices.map { mapToResponse(it) }),
                HttpStatus.OK
            )
        }

    @GetMapping("/patient/{patientId}")
    fun getInvoicesForPatient(@PathVariable patientId: String): ResponseEntity<InvoicesPerPatientResponse> =
        invoiceService.getInvoicesForPatient(PatientId(patientId)).let { invoices ->
            ResponseEntity(
                InvoicesPerPatientResponse(invoices = invoices.map { mapToResponse(it) }),
                HttpStatus.OK
            )
        }

    @PostMapping("/{invoiceId}/status")
    fun updateInvoiceStatus(
        @PathVariable invoiceId: String,
        @RequestBody requestDto: UpdateInvoiceStatusRequest
    ): ResponseEntity<InvoiceResponse> {
        val status = InvoiceStatus.valueOf(requestDto.status)
        val updatedInvoice = invoiceService.updateInvoiceStatus(InvoiceId(invoiceId), status)
            ?: return ResponseEntity(HttpStatus.NOT_FOUND)

        return ResponseEntity(mapToResponse(updatedInvoice), HttpStatus.OK)
    }

    private fun mapToResponse(invoice: Invoice): InvoiceResponse =
        InvoiceResponse(
            id = invoice.id.value,
            operationId = invoice.operationId.value,
            amount = MoneyDto(
                amount = invoice.amount.amount,
                currency = invoice.amount.currency
            ),
            status = invoice.status.name,
            createdAt = invoice.creationDateTime.format(dateFormatter),
            updatedAt = invoice.lastUpdate.format(dateFormatter)
        )

    data class InvoicesPerOperationResponse(
        val invoices: List<InvoiceResponse>
    )

    data class InvoicesPerPatientResponse(
        val invoices: List<InvoiceResponse>
    )

    data class CreateInvoiceJsonRequest(
        val operationId: String,
        val patientId: String,
        val amount: MoneyDto,
    )

    data class UpdateInvoiceStatusRequest(
        val status: String
    )

    data class InvoiceResponse(
        val id: String,
        val operationId: String,
        val amount: MoneyDto,
        val status: String,
        val createdAt: String,
        val updatedAt: String
    )
}

