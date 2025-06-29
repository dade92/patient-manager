package adapters.configuration

import adapters.patient.JdbcOperationRepository
import adapters.patient.JdbcPatientRepository
import domain.patient.OperationRepository
import domain.patient.PatientRepository
import domain.utils.InstantProvider
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
        instantProvider: InstantProvider
    ): OperationRepository =
        JdbcOperationRepository(
            dataSource,
            instantProvider
        )
}
