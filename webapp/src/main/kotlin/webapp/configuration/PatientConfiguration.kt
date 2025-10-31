package webapp.configuration

import domain.generator.PatientIdGenerator
import domain.invoice.InvoiceRepository
import domain.operation.OperationRepository
import domain.patient.PatientRepository
import domain.patient.PatientService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PatientConfiguration {

    @Bean
    fun patientIdGenerator(): PatientIdGenerator = PatientIdGenerator()

    @Bean
    fun patientService(
        patientRepository: PatientRepository,
        patientIdGenerator: PatientIdGenerator,
        operationRepository: OperationRepository,
        invoiceRepository: InvoiceRepository
    ): PatientService = PatientService(
        patientRepository,
        patientIdGenerator,
        operationRepository,
        invoiceRepository
    )
}
