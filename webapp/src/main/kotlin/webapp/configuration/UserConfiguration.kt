package webapp.configuration

import domain.generator.PatientIdGenerator
import domain.user.PatientRepository
import domain.user.PatientService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PatientConfiguration {

    @Bean
    fun userIdGenerator(): PatientIdGenerator = PatientIdGenerator()

    @Bean
    fun patientService(
        patientRepository: PatientRepository,
        patientIdGenerator: PatientIdGenerator
    ): PatientService = PatientService(
        patientRepository,
        patientIdGenerator
    )
}
