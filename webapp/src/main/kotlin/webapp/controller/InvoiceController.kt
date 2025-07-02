package webapp.controller

import domain.invoice.CreateInvoiceRequest
import domain.invoice.InvoiceService
import domain.model.InvoiceId
import domain.model.InvoiceStatus
import domain.model.OperationId
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import webapp.dto.CreateInvoiceRequestDto
import webapp.dto.InvoiceResponseDto
import webapp.dto.UpdateInvoiceStatusRequestDto
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/api/invoices")
class InvoiceController(private val invoiceService: InvoiceService) {

    private val dateFormatter = DateTimeFormatter.ISO_DATE_TIME

    @PostMapping
    fun createInvoice(@RequestBody requestDto: CreateInvoiceRequestDto): ResponseEntity<InvoiceResponseDto> {
        val request = CreateInvoiceRequest(
            operationId = OperationId(requestDto.operationId),
            amount = requestDto.amount
        )

        val invoice = invoiceService.createInvoice(request)

        return ResponseEntity(mapToResponseDto(invoice), HttpStatus.CREATED)
    }

    @GetMapping("/{invoiceId}")
    fun getInvoice(@PathVariable invoiceId: String): ResponseEntity<InvoiceResponseDto> {
        val invoice = invoiceService.getInvoice(InvoiceId(invoiceId))
            ?: return ResponseEntity(HttpStatus.NOT_FOUND)

        return ResponseEntity(mapToResponseDto(invoice), HttpStatus.OK)
    }

    @GetMapping("/operation/{operationId}")
    fun getInvoicesForOperation(@PathVariable operationId: String): ResponseEntity<List<InvoiceResponseDto>> {
        val invoices = invoiceService.getInvoicesForOperation(OperationId(operationId))

        return ResponseEntity(
            invoices.map { mapToResponseDto(it) },
            HttpStatus.OK
        )
    }

    @PatchMapping("/{invoiceId}/status")
    fun updateInvoiceStatus(
        @PathVariable invoiceId: String,
        @RequestBody requestDto: UpdateInvoiceStatusRequestDto
    ): ResponseEntity<InvoiceResponseDto> {
        try {
            val status = InvoiceStatus.valueOf(requestDto.status)
            val updatedInvoice = invoiceService.updateInvoiceStatus(InvoiceId(invoiceId), status)
                ?: return ResponseEntity(HttpStatus.NOT_FOUND)

            return ResponseEntity(mapToResponseDto(updatedInvoice), HttpStatus.OK)
        } catch (e: IllegalArgumentException) {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }
    }

    private fun mapToResponseDto(invoice: domain.model.Invoice): InvoiceResponseDto {
        return InvoiceResponseDto(
            id = invoice.id.value,
            operationId = invoice.operationId.value,
            amount = invoice.amount,
            status = invoice.status.name,
            createdAt = invoice.creationDateTime.format(dateFormatter),
            updatedAt = invoice.lastUpdateDateTime.format(dateFormatter)
        )
    }
}
