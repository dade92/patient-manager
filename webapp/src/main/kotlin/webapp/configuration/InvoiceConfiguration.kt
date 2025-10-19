package webapp.configuration

import domain.generator.InvoiceIdGenerator
import domain.invoice.InvoiceRepository
import domain.invoice.InvoiceService
import domain.operation.OperationRepository
import domain.utils.DateTimeProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import webapp.adapter.InvoiceResponseAdapter

@Configuration
class InvoiceConfiguration {

    @Bean
    fun invoiceIdGenerator(): InvoiceIdGenerator = InvoiceIdGenerator()

    @Bean
    fun invoiceService(
        invoiceRepository: InvoiceRepository,
        operationRepository: OperationRepository,
        invoiceIdGenerator: InvoiceIdGenerator,
        dateTimeProvider: DateTimeProvider
    ): InvoiceService =
        InvoiceService(
            invoiceRepository,
            operationRepository,
            invoiceIdGenerator,
            dateTimeProvider
        )

    @Bean
    fun invoiceResponseAdapter(): InvoiceResponseAdapter = InvoiceResponseAdapter()
}
