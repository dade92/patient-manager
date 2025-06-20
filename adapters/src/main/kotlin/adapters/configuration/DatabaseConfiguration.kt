package adapters.configuration

import adapters.JdbcUserRepository
import domain.user.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource

@Configuration
class DatabaseConfiguration(
    private val dataSource: DataSource
) {

    @Bean
    fun userRepository(): UserRepository = JdbcUserRepository(dataSource)
}
