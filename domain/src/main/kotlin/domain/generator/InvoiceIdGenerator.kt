package domain.generator

import domain.model.InvoiceId
import java.util.UUID

class InvoiceIdGenerator {
    fun generate(): InvoiceId = InvoiceId("INV-${UUID.randomUUID()}")
}
