package adapters.configuration

import adapters.invoice.JdbcInvoiceRepository
import adapters.operation.JdbcOperationRepository
import adapters.patient.JdbcPatientRepository
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import domain.invoice.InvoiceRepository
import domain.operation.OperationRepository
import domain.patient.PatientRepository
import domain.utils.DateTimeProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource

@Configuration
class RepositoryConfiguration(
) {
    @Bean
    fun patientRepository(dataSource: DataSource): PatientRepository =
        JdbcPatientRepository(dataSource)

    @Bean
    fun operationRepository(
        dataSource: DataSource,
        dateTimeProvider: DateTimeProvider,
        objectMapper: ObjectMapper
    ): OperationRepository =
        JdbcOperationRepository(
            dataSource,
            dateTimeProvider,
            objectMapper
        )

    @Bean
    fun invoiceRepository(
        dataSource: DataSource,
        dateTimeProvider: DateTimeProvider
    ): InvoiceRepository =
        JdbcInvoiceRepository(
            dataSource,
            dateTimeProvider
        )

    @Bean
    fun objectMapper(): ObjectMapper = ObjectMapper().registerModule(KotlinModule.Builder().build())
}
