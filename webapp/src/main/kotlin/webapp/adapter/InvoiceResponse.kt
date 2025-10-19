package webapp.adapter

data class Invoices(
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