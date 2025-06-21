package adapters.configuration

import adapters.JdbcPatientRepository
import domain.user.PatientRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource

@Configuration
class RepositoryConfiguration(
    private val dataSource: DataSource
) {

    @Bean
    fun patientRepository(): PatientRepository = JdbcPatientRepository(dataSource)
}
