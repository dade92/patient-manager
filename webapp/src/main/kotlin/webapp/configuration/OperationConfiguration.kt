package webapp.configuration

import domain.generator.OperationIdGenerator
import domain.operation.OperationRepository
import domain.operation.OperationService
import domain.patient.PatientRepository
import domain.storage.StorageService
import domain.utils.DateTimeProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OperationConfiguration {

    @Bean
    fun operationService(
        patientRepository: PatientRepository,
        operationRepository: OperationRepository,
        dateTimeProvider: DateTimeProvider,
        storageService: StorageService
    ): OperationService =
        OperationService(
            patientRepository = patientRepository,
            operationRepository = operationRepository,
            operationIdGenerator = OperationIdGenerator(),
            dateTimeProvider = dateTimeProvider,
            storageService = storageService
        )
}
