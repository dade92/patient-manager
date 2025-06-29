package webapp.configuration

import domain.generator.OperationIdGenerator
import domain.patient.OperationRepository
import domain.patient.OperationService
import domain.patient.PatientRepository
import domain.utils.InstantProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OperationConfiguration {

    @Bean
    fun operationService(
        patientRepository: PatientRepository,
        operationRepository: OperationRepository,
        instantProvider: InstantProvider
    ): OperationService {
        return OperationService(
            patientRepository = patientRepository,
            operationRepository = operationRepository,
            operationIdGenerator = OperationIdGenerator(),
            instantProvider = instantProvider
        )
    }
}
