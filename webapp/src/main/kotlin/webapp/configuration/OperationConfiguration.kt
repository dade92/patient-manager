package webapp.configuration

import domain.generator.OperationIdGenerator
import domain.operation.OperationRepository
import domain.operation.OperationService
import domain.operation.validator.CompositeOperationRequestValidator
import domain.operation.validator.EstimatedAmountEqualToDetailsSumValidator
import domain.operation.validator.OperationRequestValidator
import domain.patient.PatientRepository
import domain.storage.StorageService
import domain.utils.DateTimeProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import webapp.adapter.PatientOperationInfoAdapter
import webapp.adapter.PatientOperationResponseAdapter

@Configuration
class OperationConfiguration {

    @Bean
    fun operationService(
        patientRepository: PatientRepository,
        operationRepository: OperationRepository,
        dateTimeProvider: DateTimeProvider,
        storageService: StorageService,
        operationRequestValidator: OperationRequestValidator
    ): OperationService =
        OperationService(
            patientRepository,
            operationRepository,
            OperationIdGenerator(),
            dateTimeProvider,
            storageService,
            operationRequestValidator
        )

    @Bean
    fun operationRequestValidator(): CompositeOperationRequestValidator =
        CompositeOperationRequestValidator(
            listOf(
                EstimatedAmountEqualToDetailsSumValidator()
            )
        )

    @Bean
    fun patientOperationResponseAdapter(): PatientOperationResponseAdapter =
        PatientOperationResponseAdapter(PatientOperationInfoAdapter())
}
