package webapp.adapter

data class InvoicesPerOperationResponse(
    val invoices: List<InvoiceResponse>
)

data class InvoicesPerPatientResponse(
    val invoices: List<InvoiceResponse>
)

data class InvoiceResponse(
    val id: String,
    val operationId: String,
    val amount: MoneyDto,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)